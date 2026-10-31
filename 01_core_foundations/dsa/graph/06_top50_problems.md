# Graphs — Top 50 Problems (Intuition-Building Order)
> **How to use this list:** Work through each section in order.
> Each phase introduces a new graph traversal/algorithm pattern.
> Use the **Interview Frequency** column to prioritize must-solve problems for upcoming FAANG/Tier-1 interviews.

---

## 📊 Interview Frequency Legend

| Tier | Badge | Interview Frequency | Description | Target Companies |
|---|---|---|---|---|
| **Tier 1** | 🔥🔥🔥 **Very High** | Appears in >70% of candidate question pools | Absolute must-solve before any interview | Meta, Google, Amazon, Microsoft, Apple, Bloomberg |
| **Tier 2** | 🔥🔥 **High** | Core interview standard (35%–70%) | Regular interview staple; tests pattern variation fluency | Amazon, Google, Meta, Uber, ByteDance |
| **Tier 3** | 🔥 **Medium** | Follow-up / classic variant (<35%) | Tests edge cases, extensions, and deeper mathematical insight | Top tech phone screens & online assessments |

---

## 🏆 Top 15 Must-Solve Graph Algorithms Problems (Highest Frequency)

If you have limited time before an interview, solve these first:

| Rank | Problem | LC# | Difficulty | Frequency | Top Companies | Core Pattern / Concept |
|---|---|---|---|---|---|---|
| 1 | **Number of Islands** | 200 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google, Microsoft, Apple | DFS/BFS flood fill, mark visited |
| 2 | **Rotting Oranges** | 994 | Medium | 🔥🔥🔥 Very High | Amazon, Microsoft, Meta | Multi-source BFS, track levels (time) |
| 3 | **Clone Graph** | 133 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google | BFS/DFS + HashMap (original→clone) |
| 4 | **Course Schedule** | 207 | Medium | 🔥🔥🔥 Very High | Amazon, Google, Meta, Microsoft | Cycle detection via topo sort (Kahn's BFS) |
| 5 | **Course Schedule II** | 210 | Medium | 🔥🔥🔥 Very High | Amazon, Google, Meta | Return the topological order |
| 6 | **Alien Dictionary** | 269 | Hard | 🔥🔥🔥 Very High | Meta, Google, Airbnb, Amazon | Build graph from word order, topo sort |
| 7 | **Word Ladder** | 127 | Hard | 🔥🔥🔥 Very High | Amazon, Google, Meta, Bloomberg | BFS, each word is a node, edges = 1-char diff |
| 8 | **Longest Consecutive Sequence** | 128 | Medium | 🔥🔥🔥 Very High | Google, Amazon, Meta, Spotify | Union-Find or HashSet approach |
| 9 | **Flood Fill** | 733 | Easy | 🔥🔥 High | Amazon, Google | BFS/DFS from source, change color |
| 10 | **Max Area of Island** | 695 | Medium | 🔥🔥 High | Amazon, Meta, Google | DFS, count cells in each component |
| 11 | **Surrounded Regions** | 130 | Medium | 🔥🔥 High | Amazon, Google | BFS from borders first, then flip remaining |
| 12 | **01 Matrix** | 542 | Medium | 🔥🔥 High | Google, Amazon | Multi-source BFS from all 0s simultaneously |
| 13 | **Pacific Atlantic Water Flow** | 417 | Medium | 🔥🔥 High | Google, Amazon | Two BFS/DFS from each ocean, intersect |
| 14 | **Number of Connected Components** | 323 | Medium | 🔥🔥 High | Meta, Amazon, Google | DFS/BFS or Union-Find, count components |
| 15 | **Graph Valid Tree** | 261 | Medium | 🔥🔥 High | Meta, Google, Amazon | n-1 edges + connected = tree |


---

## Phase 1: BFS / DFS Fundamentals (Grid traversal)

*Goal: Master grid-based BFS/DFS — the most common graph problems in interviews.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 1 | Number of Islands | 200 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google, Microsoft, Apple | DFS/BFS flood fill, mark visited |
| 2 | Flood Fill | 733 | Easy | 🔥🔥 High | Amazon, Google | BFS/DFS from source, change color |
| 3 | Max Area of Island | 695 | Medium | 🔥🔥 High | Amazon, Meta, Google | DFS, count cells in each component |
| 4 | Surrounded Regions | 130 | Medium | 🔥🔥 High | Amazon, Google | BFS from borders first, then flip remaining |
| 5 | Number of Enclaves | 1020 | Medium | 🔥 Medium | Google, Amazon | Same as #4, count instead of flip |
| 6 | Rotting Oranges | 994 | Medium | 🔥🔥🔥 Very High | Amazon, Microsoft, Meta | Multi-source BFS, track levels (time) |
| 7 | 01 Matrix | 542 | Medium | 🔥🔥 High | Google, Amazon | Multi-source BFS from all 0s simultaneously |
| 8 | Pacific Atlantic Water Flow | 417 | Medium | 🔥🔥 High | Google, Amazon | Two BFS/DFS from each ocean, intersect |

---

## Phase 2: BFS / DFS on Graphs (Adjacency list)

*Goal: Move from grids to explicit graph representations.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 9 | Clone Graph | 133 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google | BFS/DFS + HashMap (original→clone) |
| 10 | Number of Connected Components | 323 | Medium | 🔥🔥 High | Meta, Amazon, Google | DFS/BFS or Union-Find, count components |
| 11 | Graph Valid Tree | 261 | Medium | 🔥🔥 High | Meta, Google, Amazon | n-1 edges + connected = tree |
| 12 | All Paths From Source to Target | 797 | Medium | 🔥🔥 High | Bloomberg, Amazon | DFS/backtracking on DAG |
| 13 | Find if Path Exists in Graph | 1971 | Easy | 🔥 Medium | Google, Amazon, Meta | BFS/DFS or Union-Find |
| 14 | Keys and Rooms | 841 | Medium | 🔥🔥 High | Google, Amazon, Meta | BFS/DFS, collect keys to unlock rooms |
| 15 | Is Graph Bipartite? | 785 | Medium | 🔥🔥 High | Amazon, Meta, Google | BFS/DFS 2-coloring |

---

## Phase 3: Topological Sort (DAGs, prerequisites)

*Goal: Order nodes respecting dependencies. Detect cycles in directed graphs.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 16 | Course Schedule | 207 | Medium | 🔥🔥🔥 Very High | Amazon, Google, Meta, Microsoft | Cycle detection via topo sort (Kahn's BFS) |
| 17 | Course Schedule II | 210 | Medium | 🔥🔥🔥 Very High | Amazon, Google, Meta | Return the topological order |
| 18 | Alien Dictionary | 269 | Hard | 🔥🔥🔥 Very High | Meta, Google, Airbnb, Amazon | Build graph from word order, topo sort |
| 19 | Minimum Height Trees | 310 | Medium | 🔥🔥 High | Google, Amazon, Meta | Peel leaves layer by layer (reverse topo) |
| 20 | Parallel Courses | 1136 | Medium | 🔥🔥 High | Google, Amazon, Meta | Topo sort, track levels = parallel rounds |
| 21 | Find All Possible Recipes | 2115 | Medium | 🔥🔥 High | Google, Amazon, Meta | Topo sort with ingredient dependencies |

---

## Phase 4: Shortest Path (BFS for unweighted, Dijkstra for weighted)

*Goal: BFS = shortest in unweighted. Dijkstra = shortest in weighted (non-negative).*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 22 | Shortest Path in Binary Matrix | 1091 | Medium | 🔥🔥 High | Google, Amazon, Meta | BFS, 8-directional, track distance |
| 23 | Word Ladder | 127 | Hard | 🔥🔥🔥 Very High | Amazon, Google, Meta, Bloomberg | BFS, each word is a node, edges = 1-char diff |
| 24 | Network Delay Time | 743 | Medium | 🔥🔥 High | Google, Amazon | Dijkstra's algorithm |
| 25 | Path With Minimum Effort | 1631 | Medium | 🔥🔥 High | Google, Amazon, Meta | Dijkstra on grid (minimize max edge) |
| 26 | Cheapest Flights Within K Stops | 787 | Medium | 🔥🔥 High | Google, Amazon | BFS/Bellman-Ford with stop limit |
| 27 | Swim in Rising Water | 778 | Hard | 🔥🔥 High | Google, Amazon, Meta | Dijkstra or binary search + BFS |
| 28 | Shortest Path to Get All Keys | 864 | Hard | 🔥🔥 High | Google, Amazon, Meta | BFS with bitmask state |

---

## Phase 5: Union-Find (Disjoint Set Union)

*Goal: Group elements dynamically. union() + find() with path compression and rank.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 29 | Number of Provinces | 547 | Medium | 🔥🔥 High | Google, Amazon, Meta | Union-Find or DFS, count components |
| 30 | Redundant Connection | 684 | Medium | 🔥🔥 High | Google, Amazon | Union-Find, edge that forms cycle |
| 31 | Accounts Merge | 721 | Medium | 🔥🔥 High | Google, Amazon, Meta | Union-Find on emails, group by person |
| 32 | Longest Consecutive Sequence | 128 | Medium | 🔥🔥🔥 Very High | Google, Amazon, Meta, Spotify | Union-Find or HashSet approach |
| 33 | Most Stones Removed | 947 | Medium | 🔥🔥 High | Google, Amazon, Meta | Union-Find on rows/cols, answer = n - components |
| 34 | Smallest String With Swaps | 1202 | Medium | 🔥🔥 High | Google, Amazon, Meta | Union-Find groups, sort within groups |

---

## Phase 6: Minimum Spanning Tree

*Goal: Kruskal's (sort edges + Union-Find) or Prim's (min-heap).*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 35 | Min Cost to Connect All Points | 1584 | Medium | 🔥🔥 High | Google, Amazon, Meta | Prim's or Kruskal's on complete graph |
| 36 | Connecting Cities With Minimum Cost | 1135 | Medium | 🔥🔥 High | Google, Amazon, Meta | Kruskal's: sort edges, union, stop at n-1 |
| 37 | Find Critical and Pseudo-Critical Edges | 1489 | Hard | 🔥🔥 High | Google, Amazon, Meta | Kruskal's + edge inclusion/exclusion |

---

## Phase 7: Advanced Graph Algorithms

*Goal: Tarjan's, Bellman-Ford, Floyd-Warshall, and special graph problems.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 38 | Critical Connections in a Network | 1192 | Hard | 🔥🔥 High | Amazon, Google | Tarjan's bridge-finding algorithm |
| 39 | Evaluate Division | 399 | Medium | 🔥🔥 High | Google, Amazon, Meta | Weighted graph, BFS/DFS for path product |
| 40 | Reconstruct Itinerary | 332 | Hard | 🔥🔥 High | Google, Amazon, Meta | Eulerian path (Hierholzer's algorithm) |
| 41 | Word Ladder II | 126 | Hard | 🔥🔥 High | Google, Amazon, Meta | BFS for shortest paths + DFS backtrack |
| 42 | Graph Coloring / m-Coloring | — | Medium | 🔥🔥 High | Google, Amazon, Meta | Backtracking with constraint checking |

---

## Phase 8: Google-Level / Multi-Pattern

*Goal: Complex state BFS, implicit graphs, advanced modeling.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 43 | Bus Routes | 815 | Hard | 🔥🔥 High | Google, Amazon, Meta | BFS on routes (not stops), route-level graph |
| 44 | Snakes and Ladders | 909 | Medium | 🔥🔥 High | Google, Amazon, Meta | BFS on board positions |
| 45 | Minimum Moves to Reach Target with Rotations | 1210 | Hard | 🔥🔥 High | Google, Amazon, Meta | BFS with state = (position, orientation) |
| 46 | Shortest Path Visiting All Nodes | 847 | Hard | 🔥🔥 High | Google, Amazon, Meta | BFS + bitmask for visited set |
| 47 | Making A Large Island | 827 | Hard | 🔥🔥 High | Google, Amazon, Meta | Label islands + check each 0's neighbors |
| 48 | Detect Cycles in 2D Grid | 1559 | Medium | 🔥🔥 High | Google, Amazon, Meta | DFS with parent tracking |
| 49 | Path With Maximum Probability | 1514 | Medium | 🔥🔥 High | Google, Amazon, Meta | Modified Dijkstra (maximize product) |
| 50 | Minimum Cost to Make at Least One Valid Path | 1368 | Hard | 🔥🔥 High | Google, Amazon, Meta | 0-1 BFS (deque-based Dijkstra) |

---

## Study Roadmap

```
Tier 1 Sprint (Emergency FAANG Prep):
  Focus exclusively on 🔥🔥🔥 (Very High) problems in the Top list above.

Complete Roadmap (Intuition-Building):

```
Week 1 (Days 1-3):  Phase 1 — Grid BFS/DFS (#1-#8)
Week 1 (Days 4-5):  Phase 2 — Graph BFS/DFS (#9-#15)
Week 2 (Days 1-2):  Phase 3 — Topological sort (#16-#21)
Week 2 (Days 3-5):  Phase 4 — Shortest path (#22-#28)
Week 3 (Days 1-2):  Phase 5 — Union-Find (#29-#34)
Week 3 (Day 3):     Phase 6 — MST (#35-#37)
Week 3 (Days 4-5):  Phase 7-8 — Advanced (#38-#50)
```
