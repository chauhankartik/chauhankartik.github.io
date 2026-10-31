# Binary Tree & BST — Top 50 Problems (Intuition-Building Order)
> **How to use this list:** Work through each section in order.
> Each phase builds on the previous one. Master the recursion and tree invariant mental models before moving on.
> Use the **Interview Frequency** column to prioritize must-solve problems for upcoming FAANG/Tier-1 interviews.

---

## 📊 Interview Frequency Legend

| Tier | Badge | Interview Frequency | Description | Target Companies |
|---|---|---|---|---|
| **Tier 1** | 🔥🔥🔥 **Very High** | Appears in >70% of candidate question pools | Absolute must-solve before any interview | Meta, Google, Amazon, Microsoft, Apple, Bloomberg |
| **Tier 2** | 🔥🔥 **High** | Core interview standard (35%–70%) | Regular interview staple; tests pattern variation fluency | Amazon, Google, Meta, Uber, ByteDance |
| **Tier 3** | 🔥 **Medium** | Follow-up / classic variant (<35%) | Tests edge cases, extensions, and deeper mathematical insight | Top tech phone screens & online assessments |

---

## 🏆 Top 15 Must-Solve Binary Tree & BST Problems (Highest Frequency)

If you have limited time before an interview, solve these first:

| Rank | Problem | LC# | Difficulty | Frequency | Top Companies | Core Pattern / Concept |
|---|---|---|---|---|---|---|
| 1 | **Lowest Common Ancestor of a Binary Tree** | 236 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Microsoft, Apple | Postorder DFS split-point detection |
| 2 | **Binary Tree Level Order Traversal** | 102 | Medium | 🔥🔥🔥 Very High | Amazon, Meta, Microsoft, Bloomberg | BFS with level queue size snapshot |
| 3 | **Validate Binary Search Tree** | 98 | Medium | 🔥🔥🔥 Very High | Amazon, Meta, Bloomberg, Microsoft | Inorder monotonic check or bounded (min, max) recursion |
| 4 | **Binary Tree Maximum Path Sum** | 124 | Hard | 🔥🔥🔥 Very High | Meta, Google, Amazon | Postorder bottom-up return single arm, update global peak |
| 5 | **Diameter of Binary Tree** | 543 | Easy | 🔥🔥🔥 Very High | Meta, Amazon, Google | Postorder depth calculation with leftDepth + rightDepth |
| 6 | **Serialize and Deserialize Binary Tree** | 297 | Hard | 🔥🔥🔥 Very High | Meta, Google, Amazon | Preorder with null delimiters or BFS stringification |
| 7 | **Binary Tree Right Side View** | 199 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google | BFS last element of level OR DFS root-right-left depth tracker |
| 8 | **Construct Binary Tree from Preorder & Inorder** | 105 | Medium | 🔥🔥🔥 Very High | Amazon, Meta, Microsoft | Hash inorder indices, slice root, divide & conquer |
| 9 | **Vertical Order Traversal of a Binary Tree** | 987 | Hard | 🔥🔥🔥 Very High | Meta, Google, Amazon | Column / row coordinates + TreeMap sorting |
| 10 | **Invert Binary Tree** | 226 | Easy | 🔥🔥 High | Google, Meta, Apple | Postorder/preorder child pointer swap |
| 11 | **Maximum Depth of Binary Tree** | 104 | Easy | 🔥🔥 High | Amazon, Meta, Google | max(depth(left), depth(right)) + 1 |
| 12 | **Kth Smallest Element in a BST** | 230 | Medium | 🔥🔥 High | Amazon, Microsoft | Inorder DFS (iterative stack or Morris) stop at k |
| 13 | **Binary Tree Cameras** | 968 | Hard | 🔥🔥 High | Google, ByteDance | Greedy postorder state machine (covered, has_camera, needs_camera) |
| 14 | **All Nodes Distance K in Binary Tree** | 863 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google | Map parent pointers, run BFS from target node |
| 15 | **House Robber III** | 337 | Medium | 🔥🔥 High | Google, Amazon | Tree DP: int[2] returning {robThis, skipThis} |

---

## Phase 1: DFS Traversal & Tree Basics

*Goal: Master structural recursion (preorder, inorder, postorder).*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 1 | Maximum Depth of Binary Tree | 104 | Easy | 🔥🔥 High | Amazon, Meta, Google | Postorder: max(left, right) + 1 |
| 2 | Minimum Depth of Binary Tree | 111 | Easy | 🔥 Medium | Amazon | Guard against single-child skews |
| 3 | Invert Binary Tree | 226 | Easy | 🔥🔥 High | Google, Meta, Apple | Swap left and right children recursively |
| 4 | Symmetric Tree | 101 | Easy | 🔥🔥 High | Amazon, Microsoft | Mirror DFS check: left.val == right.val |
| 5 | Same Tree | 100 | Easy | 🔥🔥 High | Amazon, Google | Simultaneous dual-tree DFS comparison |
| 6 | Binary Tree Inorder Traversal | 94 | Easy | 🔥🔥🔥 Very High | Amazon, Microsoft, Google | Iterative stack or Morris traversal |
| 7 | Binary Tree Preorder Traversal | 144 | Easy | 🔥🔥 High | Google, Amazon | Root -> Left -> Right iterative stack |
| 8 | Binary Tree Postorder Traversal | 145 | Easy | 🔥🔥 High | Amazon, Microsoft | Left -> Right -> Root dual stack or reverse preorder |

---

## Phase 2: BFS & Level-Order Traversal

*Goal: Master queue-based breadth-first tree traversal and level boundary extraction.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 9 | Binary Tree Level Order Traversal | 102 | Medium | 🔥🔥🔥 Very High | Amazon, Meta, Microsoft, Bloomberg | Queue size snapshot per level |
| 10 | Binary Tree Zigzag Level Order | 103 | Medium | 🔥🔥 High | Amazon, Microsoft | Alternating Deque or reverse even rows |
| 11 | Binary Tree Right Side View | 199 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google | BFS last item or DFS root-right-left |
| 12 | Average of Levels in Binary Tree | 637 | Easy | 🔥 Medium | Google, Amazon | Level sum accumulator / level size |
| 13 | Populating Next Right Pointers | 116 | Medium | 🔥🔥 High | Meta, Amazon | Parent level drives child next links (O(1) space) |
| 14 | Populating Next Right Pointers II | 117 | Medium | 🔥🔥 High | Amazon, Bloomberg | Dummy head per level for non-perfect trees |
| 15 | Deepest Leaves Sum | 1302 | Medium | 🔥 Medium | Google | Level order traversal last row accumulator |

---

## Phase 3: Path Sum & Subtree Accumulation

*Goal: Pass state downwards via parameters and bubble results upwards via return values.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 16 | Path Sum | 112 | Easy | 🔥🔥 High | Amazon, Microsoft | Target sum deduction down to leaf node |
| 17 | Path Sum II | 113 | Medium | 🔥🔥 High | Amazon, Bloomberg | Backtracking path list on leaf match |
| 18 | Path Sum III | 437 | Medium | 🔥🔥 High | Amazon, Meta | Prefix sum HashMap + DFS on tree paths |
| 19 | Binary Tree Paths | 257 | Easy | 🔥🔥 High | Google, Amazon | String path collection from root to leaf |
| 20 | Sum Root to Leaf Numbers | 129 | Medium | 🔥🔥 High | Meta, Amazon | Decimal shift: curr = curr * 10 + node.val |
| 21 | Count Nodes Equal to Average of Subtree | 2265 | Medium | 🔥 Medium | Google | Postorder: return pair {sum, count} |
| 22 | Count Good Nodes in Binary Tree | 1448 | Medium | 🔥🔥 High | Microsoft, Amazon | Pass maxSoFar down recursion tree |

---

## Phase 4: Tree Construction & Serialization

*Goal: Reconstruct unique trees from preorder/inorder/postorder arrays and strings.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 23 | Construct from Preorder & Inorder | 105 | Medium | 🔥🔥🔥 Very High | Amazon, Meta, Microsoft | Root in preorder, partition inorder with HashMap |
| 24 | Construct from Postorder & Inorder | 106 | Medium | 🔥🔥 High | Amazon, Microsoft | Root at end of postorder, partition inorder |
| 25 | Serialize and Deserialize Binary Tree | 297 | Hard | 🔥🔥🔥 Very High | Meta, Google, Amazon | Preorder with null tokens or BFS stringification |
| 26 | Flatten Binary Tree to Linked List | 114 | Medium | 🔥🔥 High | Meta, Amazon, Microsoft | Rewire right pointers via reverse postorder or Morris |
| 27 | Maximum Binary Tree | 654 | Medium | 🔥 Medium | Amazon | Monotonic stack or divide & conquer on max index |

---

## Phase 5: Lowest Common Ancestor & Diameters

*Goal: Solve tree ancestor queries and longest path problems.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 28 | Diameter of Binary Tree | 543 | Easy | 🔥🔥🔥 Very High | Meta, Amazon, Google | Postorder: max path through node = leftH + rightH |
| 29 | Lowest Common Ancestor of Binary Tree | 236 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Microsoft, Apple | If left and right return non-null, curr is LCA |
| 30 | Lowest Common Ancestor of a BST | 235 | Medium | 🔥🔥 High | Amazon, Meta | BST property: branch based on p.val and q.val vs root |
| 31 | Step-by-Step Directions (LCA to Node) | 2096 | Medium | 🔥🔥 High | Google, Amazon | Find LCA, string 'U' for start, path string for dest |
| 32 | All Nodes Distance K in Binary Tree | 863 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google | Map parents to convert tree to undirected graph, run BFS |

---

## Phase 6: Binary Search Tree (BST) Properties

*Goal: Exploit the BST invariant: left.val < root.val < right.val.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 33 | Validate Binary Search Tree | 98 | Medium | 🔥🔥🔥 Very High | Amazon, Meta, Bloomberg, Microsoft | Valid range (minVal, maxVal) or inorder strict increasing |
| 34 | Kth Smallest Element in a BST | 230 | Medium | 🔥🔥 High | Amazon, Microsoft | Inorder traversal visits BST elements in sorted order |
| 35 | Convert Sorted Array to BST | 108 | Easy | 🔥🔥 High | Amazon, Google | Mid element is root, recurse on left and right halves |
| 36 | Insert into a Binary Search Tree | 701 | Medium | 🔥🔥 High | Amazon, Google | Walk tree according to value comparison |
| 37 | Delete Node in a BST | 450 | Medium | 🔥🔥 High | Amazon, Microsoft | Replace with inorder successor/predecessor |
| 38 | Recover Binary Search Tree | 99 | Medium | 🔥🔥 High | Google, Amazon | Inorder traversal: identify 2 swapped violations |
| 39 | Binary Search Tree Iterator | 173 | Medium | 🔥🔥 High | Meta, Google, Amazon | Controlled inorder traversal using explicit Stack |
| 40 | Search in a Binary Search Tree | 700 | Easy | 🔥 Medium | Amazon | O(h) binary search recursion |

---

## Phase 7: Tree Dynamic Programming & Subtree Optimization

*Goal: Compute optimal decisions on subtrees using memoized bottom-up state.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 41 | Binary Tree Maximum Path Sum | 124 | Hard | 🔥🔥🔥 Very High | Meta, Google, Amazon | Bubble up single-arm max, update global with left+right+val |
| 42 | Binary Tree Cameras | 968 | Hard | 🔥🔥 High | Google, ByteDance | Postorder greedy 3-state DP (HAS_CAM, COVERED, PLEASE_COVER) |
| 43 | House Robber III | 337 | Medium | 🔥🔥 High | Google, Amazon | int[2] = {rob, not_rob} bottom-up DP |
| 44 | Subtree of Another Tree | 572 | Easy | 🔥🔥 High | Amazon, Meta | SameTree subroutine check across all nodes |
| 45 | Count Complete Tree Nodes | 222 | Medium | 🔥🔥 High | Google, Amazon | Binary search on leaves + bitwise path check in O(log^2 n) |
| 46 | Balanced Binary Tree | 110 | Easy | 🔥🔥 High | Google, Amazon | Return -1 from subtree if height diff > 1 |

---

## Phase 8: Advanced Views & Google-Level Combinations

*Goal: Coordinate trees, hash tables, and Morris traversals for advanced problem-solving.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 47 | Vertical Order Traversal of a Binary Tree | 987 | Hard | 🔥🔥🔥 Very High | Meta, Google, Amazon | Coordinate tracking (col, row, val) with TreeMap |
| 48 | Maximum Width of Binary Tree | 662 | Medium | 🔥🔥 High | Amazon, Google | Heap indexing: left = 2*i, right = 2*i + 1 with normalize |
| 49 | Distribute Coins in Binary Tree | 979 | Medium | 🔥🔥 High | Google, Amazon | Postorder: moves += abs(coins - 1) |
| 50 | Find Duplicate Subtrees | 652 | Medium | 🔥🔥 High | Google, Amazon | Subtree serialization + frequency HashMap |

---

## Study Roadmap

```
Tier 1 Sprint (Emergency FAANG Prep):
  Focus exclusively on 🔥🔥🔥 (Very High) problems in the Top 15 list above.

Complete Roadmap (Intuition-Building):
  Week 1 (Days 1-2):  Phase 1-2 — DFS/BFS Foundations (#1-#15)
  Week 1 (Days 3-4):  Phase 3 — Path Sum & Subtree Queries (#16-#22)
  Week 1 (Day 5):     Phase 4 — Tree Construction & Serialization (#23-#27)
  Week 2 (Days 1-2):  Phase 5 — LCA & Diameters (#28-#32)
  Week 2 (Days 3-4):  Phase 6 — BST Invariants (#33-#40)
  Week 2 (Day 5):     Phase 7 — Tree DP (#41-#46)
  Week 3 (Days 1-3):  Phase 8 — Advanced Views & Google-Level (#47-#50)
```
