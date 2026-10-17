# Advanced Graph Algorithms Masterclass

A production-grade, pattern-oriented curriculum covering the complete spectrum of advanced graph algorithms — from core representations and traversals up to network flow, bipartite matching, and strongly connected components.

---

## 🗺️ Masterclass Pattern Architecture

| Pattern | Focus Area | Canonical Algorithms & Problems | Key Complexities |
|---|---|---|---|
| **[Pattern 1](./Pattern-1-Graph-Representations-and-Traversals/)** | Representations & Traversals | Adjacency List/Matrix, BFS Shortest Path, Connected Components, Word Ladder II | Time: $O(V + E)$<br>Space: $O(V)$ |
| **[Pattern 2](./Pattern-2-Cycle-Detection-and-Topological-Sort/)** | Cycle Detection & DAG Ordering | Kahn's In-Degree BFS, 3-Color DFS (`WHITE/GRAY/BLACK`), Course Schedule I & II, Alien Dictionary | Time: $O(V + E)$<br>Space: $O(V)$ |
| **[Pattern 3](./Pattern-3-Shortest-Paths-Single-Source/)** | Single-Source Shortest Paths | Dijkstra (`PriorityQueue` with state relaxation), Bellman-Ford (Negative weights), Cheapest Flights Within K Stops | Dijkstra: $O((V + E) \log V)$<br>Bellman-Ford: $O(V \cdot E)$ |
| **[Pattern 4](./Pattern-4-All-Pairs-Shortest-Path-and-Transitive-Closure/)** | All-Pairs & Transitive Closure | Floyd-Warshall DP ($O(V^3)$), Evaluate Division, Smallest Number of Neighbors at a Threshold | Time: $O(V^3)$<br>Space: $O(V^2)$ |
| **[Pattern 5](./Pattern-5-Minimum-Spanning-Trees-MST/)** | Minimum Spanning Trees (MST) | Kruskal's (Sort edges + Union-Find), Prim's (Cut-property greedy vertex growth), Min Cost to Connect All Points | Time: $O(E \log E)$<br>Space: $O(V)$ |
| **[Pattern 6](./Pattern-6-Disjoint-Set-Union-Find/)** | Disjoint Set Union (DSU) | Path Compression + Union by Rank, Number of Provinces, Redundant Connection, Number of Islands II (Dynamic Grid) | Time: $O(\alpha(N)) \approx O(1)$<br>Space: $O(N)$ |
| **[Pattern 7](./Pattern-7-Strongly-Connected-Components-and-Bridges/)** | SCCs, Bridges & Articulation Points | Tarjan's Low-Link Discovery, Kosaraju's 2-Pass DFS, Critical Connections in a Network (LeetCode 1192) | Time: $O(V + E)$<br>Space: $O(V)$ |
| **[Pattern 8](./Pattern-8-Network-Flow-and-Bipartite-Matching/)** | Bipartite Graphs & Network Flow | 2-Color BFS/DFS, Edmonds-Karp Residual Graphs, Max Flow / Min Cut Theorem | Time: $O(V \cdot E^2)$ |

---

## 🎯 Quick Selection Guide: Which Algorithm When?

```
Is it an unweighted graph and you need the shortest path?
 └── YES ➔ Standard Breadth-First Search (BFS) [O(V + E)]

Is it a DAG and you need dependency/build ordering?
 └── YES ➔ Topological Sort (Kahn's in-degree BFS or 3-color DFS) [O(V + E)]

Does it have weighted non-negative edges and you need single-source shortest path?
 └── YES ➔ Dijkstra's Algorithm with Min-Heap [O((V + E) log V)]

Does it have negative edge weights?
 └── YES ➔ Bellman-Ford [O(V * E)] (or SPFA)

Do you need all-pairs shortest paths on dense graphs (V <= 400)?
 └── YES ➔ Floyd-Warshall DP [O(V^3)]

Are you connecting all components with minimum total edge weight?
 └── YES ➔ Kruskal's (sparse: E log E) or Prim's (dense: V^2)

Do you need dynamic connectivity / cycle detection in undirected graphs?
 └── YES ➔ Disjoint Set Union-Find (DSU) with Path Compression [O(alpha(N))]

Do you need critical communication links whose failure disconnects the network?
 └── YES ➔ Tarjan's Bridge Algorithm (discovery time & low-link values) [O(V + E)]
```

---

## 📁 Pattern Folder Layout

Each sub-pattern directory includes:
- `Core_Theory_and_Design_Tradeoffs.md`: First-principles theory, invariant proofs, and interview design choices.
- `Problem_1_Basic_*.java`: Foundational problem template with full working solution.
- `Problem_2_Medium_*.java`: Standard medium FAANG interview question.
- `Problem_3_Hard_*.java`: Advanced hard / Google-level multi-pattern problem.
