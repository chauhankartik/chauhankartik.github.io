# High-Level System Design: Zepto 10-Minute Dark-Store & Dispatch Engine

> **Interview Problem Archetype:** Flagship HLD round for SDE-2 and SDE-3 candidates at Zepto, Blinkit, and Instamart.  
> **Target Scale:** 1 Million orders per day across 500+ Dark Stores; sub-200ms API response time; 99.99% availability.

---

## 1. Anatomy of the 10-Minute SLA

In traditional e-commerce (Amazon/Flipkart), dispatch happens within hours or days. In quick commerce, the 10-minute window ($600\text{ seconds}$) is strictly budgeted:

```
[0:00 - 0:15]  Order Placement, Fraud Check, Inventory Lock
[0:15 - 2:00]  Dark Store Picker route generation & item picking (105s)
[2:00 - 2:45]  Bagging, Quality Check & Barcode Scanning (45s)
[2:45 - 3:00]  Handover to assigned Delivery Partner at dock (15s)
[3:00 - 9:30]  Transit: 1.5 km travel distance at 15–20 km/h (390s)
[9:30 - 10:00] Doorstep delivery & OTP / Geo-fence verification (30s)
```

**Key Takeaway for SDE-3:** The system *cannot* wait until an order is packed to find a rider. Rider discovery and dispatch must happen **concurrently** with dark-store picking!

---

## 2. Capacity Estimations (Back-of-the-Envelope)

* **Daily Orders:** $1,000,000\text{ orders/day}$.
* **Peak Traffic Multiplier:** $3\times$ (Peak hours: 8:00 AM – 10:30 AM and 6:30 PM – 10:00 PM).
* **Average QPS:**
  $$\text{Average QPS} = \frac{1,000,000}{86,400} \approx 12\text{ orders/sec}$$
* **Peak Order Ingestion QPS:**
  $$\text{Peak Order QPS} = 12 \times 3 \approx 36\text{ orders/sec}$$
* **Read-to-Write Ratio:** $50 : 1$ (Users browsing catalogs, checking item availability, and viewing cart).
  $$\text{Peak Read QPS} = 36 \times 50 \approx 1,800\text{ queries/sec}$$
* **Rider GPS Telemetry:**
  * Active Riders: $50,000$ concurrent riders across cities.
  * Ping Frequency: 1 ping every $4\text{ seconds}$.
  $$\text{Telemetry Ingestion QPS} = \frac{50,000}{4} = 12,500\text{ GPS pings/sec}$$

---

## 3. High-Level Distributed Architecture

```mermaid
flowchart TD
    subgraph Clients
        User[Customer Mobile App]
        Picker[Dark Store Picker App]
        Rider[Delivery Partner App]
    end

    subgraph API Gateways & Ingestion
        Kong[Kong / Envoy API Gateway]
        MQTT[EMQX / MQTT WebSocket Gateway]
    end

    subgraph Core Microservices
        CatalogSvc[Catalog & Pricing Service]
        OrderSvc[Order Lifecycle Service]
        PickerSvc[Picker Routing & Inventory Service]
        DispatchEngine[Dispatch & Batching Engine]
        TelemetrySvc[Rider Telemetry Service]
    end

    subgraph Data & Event Streaming
        Postgres[(PostgreSQL Master-Replica)]
        RedisCache[(Redis Cluster: Catalog & Carts)]
        RedisGeo[(Redis H3 Geospatial Cluster)]
        KafkaEventBus{Apache Kafka Message Broker}
    end

    User -->|Browse / Checkout| Kong
    Picker -->|Scan Barcode / Pack| Kong
    Rider -->|GPS Pings (MQTT)| MQTT

    Kong --> CatalogSvc
    Kong --> OrderSvc
    Kong --> PickerSvc

    MQTT --> TelemetrySvc
    TelemetrySvc --> RedisGeo
    TelemetrySvc -->|Rider Location Stream| KafkaEventBus

    OrderSvc --> Postgres
    CatalogSvc --> RedisCache

    OrderSvc -->|OrderPlacedEvent| KafkaEventBus
    KafkaEventBus -->|Consume Order| DispatchEngine
    KafkaEventBus -->|Consume Order| PickerSvc
    DispatchEngine --> RedisGeo
    DispatchEngine -->|Assign Rider| KafkaEventBus
```

---

## 4. Deep-Dive Subsystems & Technical Trade-offs

### A. Geospatial Indexing (Uber H3 vs. Quadtree / Geohash)
* **The Problem:** When an order is placed at dark store $DS_1$, find all `IDLE` riders within a $1.5\text{ km}$ radius who will arrive at the store within $120\text{ seconds}$.
* **Why Uber H3?**
  * H3 divides the planet into regular hexagonal cells. Unlike square grids or geohashes, **all neighbor cells in H3 have identical distances to their centroid**.
  * Each dark store and customer address maps to an H3 index (Resolution 8 or 9, cell diameter $\approx 460\text{m}$).
  * **Lookup Complexity:** Finding $k$-ring neighbors in H3 is an $O(1)$ bitwise operation:
    ```go
    // Golang H3 index lookup
    coord := h3.GeoCoord{Latitude: 12.9716, Longitude: 77.5946}
    centerHex := h3.FromGeo(coord, 9)
    nearbyHexes := h3.KRing(centerHex, 2) // Radius ~1 km
    ```

### B. Order Batching (Multi-Order Delivery)
To optimize unit economics without violating the 10-minute promise, Zepto batches orders under strict heuristics:
1. **Source Dark Store Invariant:** Both orders must originate from the exact same dark store.
2. **Destination Proximity:** Customer $B$'s drop location must be within $400\text{ meters}$ of Customer $A$, or along the direct line of travel.
3. **Time-Window Constraint:** Order $B$ must be placed within $90\text{ seconds}$ of Order $A$, and the picker must be able to assemble both within the $2\text{ minute}$ window.
4. **Volume/Weight Constraint:** Total bag volume $\le 18\text{ liters}$, weight $\le 12\text{ kg}$.

### C. Picker Route Optimization Inside the Dark Store
A dark store carries 3,000 to 8,000 SKUs packed tightly into aisles.
* Instead of random picking, the **Picker Service** solves a discrete Travelling Salesperson Problem (TSP) / Dynamic Programming path across aisles.
* High-velocity items (Milk, Bread, Bananas) are placed in the "Golden Zone" (closest to the packing dock).
* As items are scanned via handheld barcode scanners, an event (`ITEM_PICKED`) is published to Kafka, updating the live picker dashboard in real-time.

---

## 5. Failure Modes & Resiliency Strategies

| Failure Scenario | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **No Active Riders Near Dark Store** | Order cannot be delivered in 10 mins. | **Dynamic Surge & SLA Adjustment:** The API dynamically updates the displayed delivery SLA from 10 mins to 25 mins or temporarily halts new checkouts for that store. |
| **Database Lock Contention on Hot SKUs** | Checkout API latency spikes $> 2\text{s}$. | Shift inventory counters to **Redis with Lua Atomic Scripts**. Periodically sync back to PostgreSQL using the Outbox pattern. |
| **Kafka Broker Partition Outage** | Dispatch engine fails to receive `OrderPlacedEvent`. | Use replication factor 3 with `min.insync.replicas=2` and an in-memory DLQ (Dead Letter Queue) on API Gateway for direct retry. |
| **Rider GPS Drift / Telemetry Lag** | Dispatch engine assigns rider who is actually stuck in traffic. | Calculate ETA using **Kalman Filter smoothing** over the last 5 GPS points instead of raw coordinates. |
