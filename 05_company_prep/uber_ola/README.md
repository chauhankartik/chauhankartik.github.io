# Uber & Ola — SDE-2 & SDE-3 Interview Preparation Guide

Uber and Ola operate planetary-scale mobility and logistics networks. Their technical loops are renowned for rigorous **geospatial indexing, distributed telemetry ingestion, location stream processing, and lock-free concurrency**.

---

## 1. Interview Loop Overview

| Round | Focus | Expected Competency |
| :--- | :--- | :--- |
| **Round 1: Problem Solving & Algorithms** | 2 Algorithmic problems (60 mins) | Interval graphs, Union-Find, Sliding Window, Topological Sort. |
| **Round 2: Machine Coding & LLD** | Working code with deep concurrency (90 mins) | Custom thread pools, lock-free queues, geospatial matching in memory. |
| **Round 3: High-Level System Design** | Distributed geospatial architecture (60 mins) | Uber H3 indexing, location stream ingestion, dynamic surge pricing, trip dispatch. |
| **Round 4: Bar Raiser & Architecture Defense** | Past project deep dive & trade-offs (60 mins) | Network protocols (QUIC/HTTP3, WebSockets), Kafka partitioning, distributed locks. |

---

## 2. High-Frequency Interview Questions

### Problem Solving (DSA)
* **[Bus Routes](https://leetcode.com/problems/bus-routes/):** Multi-hop graph traversal.
* **[Accounts Merge](https://leetcode.com/problems/accounts-merge/):** Disjoint Set Union (DSU) for user deduplication.
* **[Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/):** Interval min-heap / sweep line algorithm.
* **[Design In-Memory File System](https://leetcode.com/problems/design-in-memory-file-system/):** Trie with directory hierarchies.

### Machine Coding / LLD
* **Design Ride Matching Engine:** Match nearest driver within $R$ km; handle race conditions when two drivers accept the same ride.
* **Design a Distributed Rate Limiter:** Sliding window log / token bucket with atomic operations.
* **Design an Event Bus:** Thread-safe pub-sub library with topic subscriptions and thread pool dispatchers.

### High-Level System Design (HLD)
* **Design Uber Rider-Driver Matching & Dispatch System:** Geospatial partitioning using Uber H3, WebSockets/gRPC streaming, two-phase commit or distributed locks for booking.
* **Design Real-Time Driver Location Ingestion Pipeline:** 1 Million drivers sending GPS coordinates every 4 seconds. Ingestion via Kafka, hot-cache in Redis Geo, persistent time-series storage in Cassandra/Scylla.
* **Design Dynamic Surge Pricing Engine:** Dynamic supply vs. demand heatmaps calculated per H3 hex cell every 10 seconds.
