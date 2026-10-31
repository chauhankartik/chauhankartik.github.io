# Swiggy & Zomato — SDE-2 & SDE-3 Interview Preparation Guide

Swiggy and Zomato are India's leading consumer tech platforms covering food delivery, dining, and quick commerce (Instamart & Blinkit). Their technical loops focus on **multi-sided marketplaces (Customer, Merchant, Delivery Partner), surge pricing, geospatial dispatch, and distributed transactional consistency**.

---

## 1. Interview Loop Overview

| Round | Focus | Expected Competency |
| :--- | :--- | :--- |
| **Round 1: Problem Solving & DSA** | 2 LeetCode Medium/Hard problems (60 mins) | Graphs (BFS/DFS), Dynamic Programming, Priority Queues, Sliding Window. |
| **Round 2: Low-Level Design (LLD)** | Machine coding (90 mins) | Extensible clean code, GoF patterns (Strategy, State, Observer), concurrency. |
| **Round 3: High-Level Design (HLD)** | Distributed architecture (60 mins) | Microservices, real-time rider tracking, dynamic surge pricing, order assignment. |
| **Round 4: Bar Raiser & Engineering Leadership** | Cultural fit & systems trade-offs (60 mins) | High-scale operational challenges, conflict resolution, production resilience. |

---

## 2. High-Frequency Interview Questions

### Problem Solving (DSA)
* **[Course Schedule II](https://leetcode.com/problems/course-schedule-ii/):** Dependency management for order delivery milestones.
* **[Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/):** Shortest path with hop constraints (Dijkstra / Bellman-Ford).
* **[Design Hit Counter](https://leetcode.com/problems/design-hit-counter/):** Tracking order requests per second with circular arrays.
* **[Task Scheduler](https://leetcode.com/problems/task-scheduler/):** Greedy priority queue for scheduling batch cooking orders.

### Machine Coding / LLD
* **Design an Online Food Ordering System:** Menu browsing, cart calculation, delivery fee rules, and order state transitions.
* **Design a Dynamic Surge Pricing Engine:** Calculate real-time multiplier based on active orders vs. available riders in a geofence.
* **Design an In-Memory Key-Value Store with TTL & Transactions:** Atomic `GET`, `SET`, `BEGIN`, `COMMIT`, `ROLLBACK`.

### High-Level System Design (HLD)
* **Design Swiggy Instamart / Zomato Blinkit:** Dark store layout, inventory reservations, picking, and delivery partner dispatch.
* **Design a Real-Time Surge Pricing Engine:** Ingesting live rider-to-order demand ratios and pushing pricing updates to millions of apps.
* **Design a Restaurant Menu & Catalog Search Service:** Elasticsearch/Solr cluster, faceted search, filtering by pure-veg, rating, distance.
