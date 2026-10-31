# Amazon & Flipkart — SDE-2, SDE-3 & Principal Interview Preparation Guide

Amazon and Flipkart operate massive e-commerce and retail cloud platforms. At Amazon, technical evaluations are strictly paired with **Amazon's 16 Leadership Principles (LPs)**. At Flipkart, machine coding and production-level low-level design are paramount.

---

## 1. Interview Loop Overview

| Round | Focus | Expected Competency |
| :--- | :--- | :--- |
| **Round 1 & 2: DSA & Problem Solving** | 2 Medium/Hard problems + 2 LP questions (60 mins) | Trees, Graphs, DP, Priority Queues + Customer Obsession / Ownership. |
| **Round 3: Object-Oriented Design (OOD/LLD)** | Extensible class design & clean code (60 mins) | SOLID principles, GoF patterns, clean encapsulation, unit testing. |
| **Round 4: High-Level System Design (HLD)** | Scalable microservices architecture (60 mins) | High availability, DynamoDB single-table design, asynchronous decoupling (SQS/SNS). |
| **Round 5: Bar Raiser** | Independent evaluation on culture & systems (60 mins) | Deep dive into technical failures, conflict resolution, LP mastery (STAR method). |

---

## 2. High-Frequency Interview Questions

### Problem Solving (DSA)
* **[Critical Connections in a Network](https://leetcode.com/problems/critical-connections-in-a-network/):** Tarjan's algorithm for finding bridges in a network.
* **[Word Ladder II](https://leetcode.com/problems/word-ladder-ii/):** BFS + Backtracking for shortest transformation sequence.
* **[Reorganize String](https://leetcode.com/problems/reorganize-string/):** Max-heap with greedy character placement.
* **[LRU Cache](https://leetcode.com/problems/lru-cache/):** Doubly linked list + Hash map implementation.

### Object-Oriented Design (LLD)
* **Design an Amazon Locker Delivery System:** Package allocation based on locker slot sizes, pickup codes, and timeout expiration.
* **Design an E-Commerce Shopping Cart & Promotion Engine:** Multi-item carts, coupon applicability, shipping fee rules, tax calculations.
* **Design a Vending Machine / Parking Lot:** Multi-tier parking slots, vehicle types, ticketing, and payment strategies.

### High-Level System Design (HLD)
* **Design an E-Commerce Flash Sale System (Prime Day / Big Billion Days):** Handling millions of concurrent cart checkouts without inventory corruption.
* **Design Amazon Product Search & Auto-Suggest:** Elasticsearch cluster, trie-based prefix searching, ranking signals.
* **Design a Distributed Task Scheduler:** Cron expression evaluation, distributed queue (SQS/Kafka), worker node heartbeats.
