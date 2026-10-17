# DSA Mastery — Google Interview Preparation

A structured, pattern-oriented study module for mastering Data Structures & Algorithms, built for senior and Google-level technical interviews.

Each module follows the same proven structure:
- **Deep theory** with internal mechanics and complexity proofs
- **Problems categorized by difficulty** — Easy → Medium → Hard → Google-level
- **Brute force → optimal** progression with interview-ready explanations
- **Cheatsheet** for 30-second recall
- **Top 50 problem list** ordered by intuition-building progression

---

## 📂 Modules & Pedagogical Learning Path

### Phase 1: Core Linear Foundations
| Module | Focus & Patterns | Files |
|---|---|---|
| [Array](./array/) | Memory Contiguity, Two Pointers, Prefix Sums, Kadane's, Binary Search, Matrix | 7 files |
| [Two Pointers](./twopointers/) | Left-Right Pointers, Fast-Slow Pointers, Container With Most Water, 3Sum | 7 files |
| [Sliding Window](./sliding_window/) | Fixed Window, Dynamic Window, Monotonic Deque, Substring Maps | 7 files |
| [Linked List](./linkedlist/) | Pointer Inversion, Cycle Detection (Floyd's), Merge K Sorted Lists, LRU Cache | 5 files |
| [Stack](./stack/) | LIFO Parsing, Balanced Parentheses, Monotonic Stack Linear Lookbehinds | 7 files |
| [Queue](./queue/) | FIFO Buffers, Circular Queues, Monotonic Deques, Breadth Buffering | 7 files |
| [Hashing](./hashing/) | Frequency Counting, Complement Lookup, Prefix+HashMap, Distributed Hash Maps | 8 files |
| [Linear Data Structures Masterclass](./Linear-Data-Structures-Masterclass/) | 7 Master Patterns: Stacks, Deques, Heaps, Two Heaps & Stream Buffering | 28+ files |

### Phase 2: Hierarchical, Trees & Combinatorial Search
| Module | Focus & Patterns | Files |
|---|---|---|
| [Tree](./tree/) | Binary Trees, BST Invariants, DFS/BFS, Lowest Common Ancestor (LCA), Serializer | 5 files |
| [Trie](./trie/) | Prefix Trees, Bitwise XOR Tries, Autocomplete Engines, Word Search II | 7 files |
| [Greedy](./greedy/) | Interval Scheduling, Two-Pointer Greedy, Heap Greedy, Monotonic Stacks | 7 files |
| [Backtracking](./backtracking/) | State-Space Search Trees, Choose-Explore-Unchoose, Pruning, N-Queens, Sudoku | 7 files |

### Phase 3: Advanced Graphs, Geometry & Dynamic Programming
| Module | Focus & Patterns | Files |
|---|---|---|
| [Graph](./graph/) | BFS/DFS, Cycle Detection, Kahn's Topo Sort, Dijkstra, Bellman-Ford, Tarjan's | 7 files |
| [Graph Algorithms Masterclass](./Graph-Algorithms-Masterclass/) | 8 Master Patterns: Single-Source & All-Pairs Shortest Paths, MST, DSU, Bridges, Flow | 32+ files |
| [Dynamic Programming Masterclass](./dynamicprogramming/) | 9 Master Patterns: Linear DP, 0/1 Knapsack, Unbounded, Matrix DP, Interval, Bitmask | 20+ files |
| [Line Sweep](./linesweep/) | 1D & 2D Event Sweeping, Interval Overlaps, Meeting Rooms II, Skyline Problem | 2 files |

---

## 🗺️ Learning Path

Work through modules in this order for maximum concept transfer:

```
Phase 1: Linear Foundations
 └── 1. Array ➔ 2. Two Pointers ➔ 3. Sliding Window ➔ 4. Linked List ➔ 5. Stack ➔ 6. Queue ➔ 7. Hashing ➔ 8. Linear DS Masterclass

Phase 2: Hierarchical & State-Space
 └── 9. Tree ➔ 10. Trie ➔ 11. Greedy ➔ 12. Backtracking

Phase 3: Complex Graphs & Dynamic Optimization
 └── 13. Graph ➔ 14. Graph Masterclass ➔ 15. Dynamic Programming ➔ 16. Line Sweep
```

Within each module, follow the **Phase order** in `06_top50_problems.md`:

```
Phase 1 → Phase 2 → ... → Phase 7/8
(basics)                  (Google-level)
```

---

## 🎯 Problem Format

Every problem follows this structure:

```java
// =========================================================
// PROBLEM NAME
// Pattern: <pattern tag>
// LeetCode: <LC#>
// =========================================================
/**
 * Problem: [description]
 *
 * Brute Force O(...): [approach]
 *
 * Optimal O(...): [approach]
 * Why does this work? [proof/intuition]
 *
 * Time:  O(...)
 * Space: O(...)
 */
public ReturnType solution(args) { ... }

/**
 * Follow-up 1: [harder variant]
 *   → [approach]
 *
 * Follow-up 2: [another variant]
 *   → [approach]
 */
```

---

## ⚡ Complexity Quick Reference

| Structure / Algorithm | Access | Search | Insert | Delete |
|---|---|---|---|---|
| Array | O(1) | O(n) | O(n) | O(n) |
| HashMap | — | O(1) avg | O(1) avg | O(1) avg |
| TreeMap | — | O(log n) | O(log n) | O(log n) |
| BFS / DFS | — | O(V+E) | — | — |
| Dijkstra | — | O((V+E) log V) | — | — |
| Union-Find | — | O(α(n)) ≈ O(1) | O(α(n)) | — |

---

## 🧠 Interview Pattern Cheat-Sheet

| If the problem says... | Think... |
|---|---|
| "Sorted array" + "two values sum to" | Two Pointers |
| "Contiguous subarray" + "max/min/count" | Sliding Window |
| "Subarray sum = k" (mixed +/-) | Prefix Sum + HashMap |
| "Maximum subarray sum" | Kadane's Algorithm |
| "Shortest path" (unweighted) | BFS |
| "Shortest path" (weighted, non-negative) | Dijkstra |
| "Is there a cycle?" / "connected components" | Union-Find or DFS |
| "Prerequisites" / "ordering" | Topological Sort |
| "K largest/smallest" | Min/Max Heap |
| "Sliding window maximum" | Monotonic Deque |
| "Binary search on answer" | isFeasible + Binary Search |
| "Exactly K distinct" | atMost(K) - atMost(K-1) |

---

## 🗓️ Suggested Study Schedule

| Week | Focus | Goal |
|---|---|---|
| 1 | Array (Phases 1-4) | Two pointers, prefix sum, Kadane's, binary search |
| 2 | Array (Phases 5-8) + Hashing (Phases 1-4) | Intervals, matrix, freq counting, complement lookup |
| 3 | Hashing (Phases 5-8) + Sliding Window (Phases 1-3) | Design, prefix+map, fixed/variable windows |
| 4 | Sliding Window (Phases 4-7) | Freq matching, counting, monotonic deque |
| 5 | Graph (Phases 1-4) | BFS/DFS on grids, adjacency list, topo sort, Dijkstra |
| 6 | Graph (Phases 5-8) | Union-Find, MST, Tarjan's, advanced graph |
| 7 | Mixed revision | Do 2-3 Google-level problems per topic daily |

---

## 💬 Interview Communication Template

> *"Let me classify this problem. I see [constraint/keyword]. My first instinct is [pattern].
> Let me verify:*
> - *Can I use [approach]? Does that preserve the answer?*
> - *What's the constraint that makes [brute force] O(n²)? And how does [pattern] break it?*
>
> *I'll implement [optimal approach]. Time is O([...]) because [1-sentence proof].
> Space is O([...]) because [reason]."*

---

## 📖 Resources Referenced

- *Cracking the Coding Interview* — Gayle Laakmann McDowell
- *Elements of Programming Interviews in Java* — Aziz, Lee, Prakash
- LeetCode problem set (LC# referenced in every problem)
- Java Documentation — `java.util` Collections, Arrays, PriorityQueue internals
