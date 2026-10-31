# Google & Meta — L4 (SDE-2), L5 (Senior SDE) & Staff Interview Preparation Guide

Google and Meta represent the pinnacle of algorithmic depth and planetary-scale systems engineering. Google places extreme emphasis on **algorithmic optimization, mathematical bounds, and non-standard problem variants**. Meta emphasizes **rapid coding speed (2 Medium/Hard problems in 45 minutes) and pragmatic, scalable systems design**.

---

## 1. Interview Loop Overview

| Round | Focus | Expected Competency |
| :--- | :--- | :--- |
| **Coding Rounds (2 to 3)** | Algorithmic Problem Solving (45 mins each) | DP, Graphs, Binary Search on Answer, Trees, Tries. Fast bug-free coding. |
| **System Design (1 to 2)** | Large-Scale Distributed Architecture (45 mins) | Multi-datacenter replication, caching hierarchies, CAP/PACELC trade-offs, capacity math. |
| **Googlyness & Leadership (1)** | Behavioral & Collaboration (45 mins) | Navigating ambiguity, ethical engineering, psychological safety, driving consensus. |

---

## 2. High-Frequency Interview Questions

### Problem Solving (DSA)
* **[Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/):** Binary search on partition ($O(\log(\min(m, n)))$).
* **[Alien Dictionary](https://leetcode.com/problems/alien-dictionary/):** Topological sorting over custom character order.
* **[Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix/):** Memoized DFS / DAG longest path.
* **[Burst Balloons](https://leetcode.com/problems/burst-balloons/):** Range Dynamic Programming ($O(N^3)$).
* **[Shortest Distance from All Buildings](https://leetcode.com/problems/shortest-distance-from-all-buildings/):** Multi-source BFS matrix search.

### High-Level System Design (HLD)
* **Design Google Drive / Dropbox Sync Engine:** Chunking files, rolling hash (Rabin-Karp), deduplication, differential sync, metadata database.
* **Design Meta News Feed:** Fanout-on-write vs. fanout-on-load, ranking service, feed caching, timeline pagination.
* **Design Global Distributed Rate Limiter:** Edge-layer Envoy rate limiting with local token buckets synchronized via consensus.
* **Design Distributed Web Crawler:** URL frontier, DNS caching, politeness delay, SimHash for near-duplicate detection.
