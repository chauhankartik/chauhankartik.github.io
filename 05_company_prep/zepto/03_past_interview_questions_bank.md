# Zepto SDE-2 & SDE-3 Past Interview Questions Bank

This question bank is collated from verified interview experiences (LeetCode Discuss, Glassdoor, GeeksforGeeks, and candidate debriefs) across recent Zepto SDE-2 and SDE-3 hiring cycles.

---

## 1. Problem Solving & Data Structures (DSA)

### Dynamic Programming & Greedy
1. **Minimum Cost For Tickets ([LeetCode 983](https://leetcode.com/problems/minimum-cost-for-tickets/)):**
   * *Asked in:* Round 1 Screening (BarRaiser).
   * *Variant:* Calculate minimum delivery pass subscription cost given a list of scheduled delivery days.
2. **Best Time to Buy and Sell Stock with Cooldown ([LeetCode 309](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/)):**
   * *Focus:* State machine DP approach with $O(1)$ space.
3. **Coin Change ([LeetCode 322](https://leetcode.com/problems/coin-change/)):**
   * *Variant:* Given dark store delivery bag capacities, find minimum bags needed to pack items of varying volumes.

### Graphs & Breadth-First Search
4. **Rotting Oranges ([LeetCode 994](https://leetcode.com/problems/rotting-oranges/)):**
   * *Asked in:* Round 1 & Round 2 (Very High Frequency).
   * *Focus:* Multi-source BFS with strict boundary checks.
5. **Bus Routes ([LeetCode 815](https://leetcode.com/problems/bus-routes/)):**
   * *Focus:* BFS on hypergraph (buses vs. stops) to find minimum transfers.
6. **Destination City ([LeetCode 1436](https://leetcode.com/problems/destination-city/)):**
   * *Focus:* Hash set / Directed graph out-degree traversal.
7. **Word Ladder ([LeetCode 127](https://leetcode.com/problems/word-ladder/)):**
   * *Focus:* Bidirectional BFS to minimize search frontier.

### Monotonic Stacks & Interval Geometry
8. **Daily Temperatures ([LeetCode 739](https://leetcode.com/problems/daily-temperatures/)):**
   * *Focus:* Monotonic decreasing stack.
9. **Merge Intervals ([LeetCode 56](https://leetcode.com/problems/merge-intervals/)):**
   * *Variant:* Merge scheduled dark-store replenishment truck delivery time slots.
10. **Sliding Window Maximum ([LeetCode 239](https://leetcode.com/problems/sliding-window-maximum/)):**
    * *Focus:* Monotonic deque with indices tracking window bounds.

---

## 2. Low-Level Design (LLD) & Machine Coding

1. **Design a Coupon & Promotion Engine for Zepto:**
   * Support percentage discount (`10% OFF`), flat discount (`FLAT 50`), buy-2-get-1, and cashback.
   * Coupons can have expiration dates, minimum cart value, and category constraints.
   * Apply GoF **Strategy Pattern** for discount computation and **Decorator Pattern** for stacking.
2. **Design an Inventory Locker for Dark Stores:**
   * Manage stock reserves across multiple dark stores.
   * Handle race conditions when multiple users try to check out the last remaining SKU.
   * Implement 10-minute temporary reservation holding with automated background expiration.
3. **Design a Hyperlocal Delivery Partner Dispatcher:**
   * Match available riders within 1.5 km of dark store.
   * State transitions: `IDLE`, `ASSIGNED`, `REACHED_STORE`, `OUT_FOR_DELIVERY`, `DELIVERED`.
   * Rider state changes must notify matching service via **Observer Pattern**.
4. **Design an Online Book Reader (Kindle-style):**
   * User library management, bookmarking, font size rendering configurations, and last-read page tracking.
5. **Design a Chess Game:**
   * Focus on move validation, board representation, piece inheritance, and checkmate detection.

---

## 3. High-Level System Design (HLD)

1. **Design Zepto's 10-Minute Dark-Store & Rider Dispatch Engine:**
   * Real-time dark store allocation based on user geofence.
   * Rider matching within 120 seconds of order placement.
   * Handling surge traffic during peak festival hours without violating the 10-minute promise.
2. **Design a Flash-Sale Real-Time Inventory Service:**
   * Handle 20,000 requests/sec attempting to purchase 500 limited-edition items.
   * Prevent overselling while maintaining sub-100ms response times.
   * Discussion of Redis Lua scripts vs. PostgreSQL row locks vs. distributed locks.
3. **Design a Live GPS Telemetry & Rider Tracking Service:**
   * Ingesting 50,000 GPS coordinates every 3-4 seconds.
   * Using Uber H3 or Google S2 for hexagonal geospatial indexing.
   * WebSockets vs. MQTT for delivering live rider movement to customer apps.
4. **Design a Distributed Calendar / Appointment Booking System:**
   * Conflict detection, distributed locking, recurring event expansion, and reminder notifications.
5. **Design a Live Video Streaming Service (Twitch / Hotstar Live):**
   * Ingestion, adaptive bitrate transcoding (HLS/DASH), edge CDN distribution, and live chat high concurrency.

---

## 4. Database & Core Systems Deep-Dive Questions

1. **PostgreSQL & Database Internals:**
   * *"What happens under the hood when you execute `SELECT ... FOR UPDATE SKIP LOCKED`?"*
   * *"Explain PostgreSQL MVCC (Multi-Version Concurrency Control) and why VACUUM is required."*
   * *"When does a composite B-Tree index become ineffective? Explain leftmost prefix matching."*
   * *"How does connection pooling work in PgBouncer (Transaction vs. Session pooling)?"*
2. **Kafka & Streaming:**
   * *"How do you guarantee strictly ordered event processing for an order while scaling to 64 consumer instances?"*
   * *"What causes consumer rebalances in Kafka, and how do cooperative rebalances solve stop-the-world latency spikes?"*
   * *"Explain the Transactional Outbox Pattern and why it is superior to two-phase commits (2PC) in microservices."*
3. **Redis & Caching:**
   * *"Explain the Cache Stampede (Thundering Herd) problem. How does singleflight or probabilistic early expiration prevent database crashes?"*
   * *"Compare Redis Sentinel vs. Redis Cluster. How does Redis Cluster partition keys via 16,384 hash slots?"*

---

## 5. Behavioral & Hiring Manager (HM) Questions

1. *"Describe an architectural decision you made at your current company that you now regret. What trade-offs did you miscalculate, and how did you resolve it?"*
2. *"How do you manage technical debt when product managers insist on launching features under aggressive timelines?"*
3. *"Walk me through an incident where your service went down during peak business hours. What was your immediate mitigation strategy, and what permanent guardrail was built?"*
4. *"How do you conduct code reviews? What do you look for beyond formatting and syntax?"*
5. *"Why do you want to join Zepto, where engineering runs in a 24/7 high-pressure operations environment, rather than a traditional SaaS company?"*
