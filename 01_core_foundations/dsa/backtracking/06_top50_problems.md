# Recursion & Backtracking — Top 50 Problems (Intuition-Building Order)
> **How to use this list:** Work through each section in order.
> Each phase builds on the previous one. Don't skip ahead until the pattern clicks.
> Use the **Interview Frequency** column to prioritize must-solve problems for upcoming FAANG/Tier-1 interviews.

---

## 📊 Interview Frequency Legend

| Tier | Badge | Interview Frequency | Description | Target Companies |
|---|---|---|---|---|
| **Tier 1** | 🔥🔥🔥 **Very High** | Appears in >70% of candidate question pools | Absolute must-solve before any interview | Meta, Google, Amazon, Microsoft, Apple, Bloomberg |
| **Tier 2** | 🔥🔥 **High** | Core interview standard (35%–70%) | Regular interview staple; tests pattern variation fluency | Amazon, Google, Meta, Uber, ByteDance |
| **Tier 3** | 🔥 **Medium** | Follow-up / classic variant (<35%) | Tests edge cases, extensions, and deeper mathematical insight | Top tech phone screens & online assessments |

---

## 🏆 Top 15 Must-Solve Recursion & Backtracking Problems (Highest Frequency)

If you have limited time before an interview, solve these first:

| Rank | Problem | LC# | Difficulty | Frequency | Top Companies | Core Pattern / Concept |
|---|---|---|---|---|---|---|
| 1 | **Subsets / Power Set** | 78 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google | Basic inclusion / exclusion |
| 2 | **Combination Sum I** | 39 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google | Candidate combination with unlimited reuse |
| 3 | **Letter Combinations of Phone Number** | 17 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google | Keypad digit letter branching |
| 4 | **Generate Parentheses** | 22 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Microsoft | Open / close count constraints |
| 5 | **Permutations** | 46 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google | `boolean[] used` array tracking |
| 6 | **Word Search I** | 79 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Bloomberg | Grid DFS + `board[r][c] = '#'` |
| 7 | **Number of Islands** | 200 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google, Microsoft, Apple | Grid DFS component sink |
| 8 | **Remove Invalid Parentheses** | 301 | Hard | 🔥🔥🔥 Very High | Meta, Google | Min removal count + DFS |
| 9 | **Combinations** | 77 | Medium | 🔥🔥 High | Google, Amazon | Range 1..N combination of size K |
| 10 | **Binary Tree Paths** | 257 | Easy | 🔥🔥 High | Google, Amazon | Tree root-to-leaf path collection |
| 11 | **Beautiful Arrangement** | 526 | Medium | 🔥🔥 High | Meta, Amazon, Google | Divisibility check per position |
| 12 | **Letter Case Permutation** | 784 | Medium | 🔥🔥 High | Meta, Amazon, Google | Lowercase / uppercase branch per char |
| 13 | **Sequential Digits** | 1291 | Medium | 🔥🔥 High | Meta, Amazon, Google | Sliding window / recursive digit generation |
| 14 | **Subsets II** | 90 | Medium | 🔥🔥 High | Amazon, Meta | `i > start && nums[i] == nums[i-1]` |
| 15 | **Permutations II** | 47 | Medium | 🔥🔥 High | Amazon, Google | `!used[i-1] && nums[i] == nums[i-1]` |


---

## Phase 1: Subsets & Combinations Foundations

*Goal: Master inclusion/exclusion and range-based combination generation.*

| # | Problem | LC# / CSES | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 1 | Subsets / Power Set | 78 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google | Basic inclusion / exclusion |
| 2 | Combinations | 77 | Medium | 🔥🔥 High | Google, Amazon | Range 1..N combination of size K |
| 3 | Combination Sum I | 39 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google | Candidate combination with unlimited reuse |
| 4 | Letter Combinations of Phone Number | 17 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google | Keypad digit letter branching |
| 5 | Generate Parentheses | 22 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Microsoft | Open / close count constraints |
| 6 | Sum of All Subset XOR Totals | 1863 | Easy | 🔥 Medium | Google, Amazon | Subset XOR tree sum |
| 7 | Binary Tree Paths | 257 | Easy | 🔥🔥 High | Google, Amazon | Tree root-to-leaf path collection |

---

## Phase 2: Permutations & Visited Tracking

*Goal: Master visited array tracking and fixed-length ordering.*

| # | Problem | LC# / CSES | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 8 | Permutations | 46 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google | `boolean[] used` array tracking |
| 9 | Beautiful Arrangement | 526 | Medium | 🔥🔥 High | Meta, Amazon, Google | Divisibility check per position |
| 10 | Letter Case Permutation | 784 | Medium | 🔥🔥 High | Meta, Amazon, Google | Lowercase / uppercase branch per char |
| 11 | Sequential Digits | 1291 | Medium | 🔥🔥 High | Meta, Amazon, Google | Sliding window / recursive digit generation |

---

## Phase 3: Duplicate Handling & Sister Branch Pruning

*Goal: Master sorting + skipping duplicate elements at the same tree depth.*

| # | Problem | LC# / CSES | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 12 | Subsets II | 90 | Medium | 🔥🔥 High | Amazon, Meta | `i > start && nums[i] == nums[i-1]` |
| 13 | Permutations II | 47 | Medium | 🔥🔥 High | Amazon, Google | `!used[i-1] && nums[i] == nums[i-1]` |
| 14 | Combination Sum II | 40 | Medium | 🔥🔥 High | Meta, Amazon | Single use + duplicate skip |
| 15 | Combination Sum III | 216 | Medium | 🔥🔥 High | Amazon, Google | Range 1..9 combination sum of size K |
| 16 | Palindrome Partitioning | 131 | Medium | 🔥🔥 High | Meta, Amazon | String prefix palindrome check |

---

## Phase 4: Grid Backtracking & In-Place Cell Marking

*Goal: Master 2D matrix DFS, in-place visited marking, and path restoration.*

| # | Problem | LC# / CSES | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 17 | Word Search I | 79 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Bloomberg | Grid DFS + `board[r][c] = '#'` |
| 18 | Flood Fill | 733 | Easy | 🔥🔥 High | Amazon, Google | Grid DFS color replacement |
| 19 | Number of Islands | 200 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google, Microsoft, Apple | Grid DFS component sink |
| 20 | Surround Regions | 130 | Medium | 🔥🔥 High | Amazon, Google | Boundary-connected DFS |
| 21 | Max Area of Island | 695 | Medium | 🔥🔥 High | Amazon, Meta, Google | Grid DFS area accumulator |
| 22 | Path with Maximum Gold | 1219 | Medium | 🔥🔥 High | Meta, Amazon, Google | Grid DFS max gold path |

---

## Phase 5: Constraint Satisfaction & Bitmasking (Queens & Sudoku)

*Goal: Fast collision detection using bitmasks and arrays.*

| # | Problem | LC# / CSES | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 23 | N-Queens I | 51 | Hard | 🔥🔥 High | Google, Amazon | Array / Bitmask diagonal tracking |
| 24 | N-Queens II | 52 | Hard | 🔥 Medium | Amazon | N-Queens solution count |
| 25 | Sudoku Solver | 37 | Hard | 🔥🔥 High | Google, Microsoft | 9x9 Bitmask collision check |
| 26 | Valid Sudoku | 36 | Medium | 🔥🔥 High | Meta, Amazon, Google | Sudoku constraint validation |

---

## Phase 6: Partitioning & Subset Sum Matching

*Goal: Bucket partitioning, target sum matching, and descending sort pruning.*

| # | Problem | LC# / CSES | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 27 | Partition to K Equal Sum Subsets | 698 | Medium | 🔥🔥 High | Google, Amazon | Sort descending + bucket filling |
| 28 | Matchsticks to Square | 473 | Medium | 🔥 Medium | Google, Amazon | 4-side target sum bucket filling |
| 29 | Target Sum | 494 | Medium | 🔥🔥 High | Meta, Amazon | Expression sign choice (+/-) |
| 30 | Restore IP Addresses | 93 | Medium | 🔥🔥 High | Amazon, Google | 4-part string segment partitioning |
| 31 | Split Array into Fibonacci Sequence | 842 | Medium | 🔥🔥 High | Meta, Amazon, Google | Numeric string Fibonacci partitioning |

---

## Phase 7: Expression Parsing & String Manipulation

*Goal: Parse arithmetic expressions, boolean trees, and string operators.*

| # | Problem | LC# / CSES | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 32 | Expression Add Operators | 282 | Hard | 🔥🔥 High | Meta, Google | Operand evaluation with multiplication |
| 33 | Remove Invalid Parentheses | 301 | Hard | 🔥🔥🔥 Very High | Meta, Google | Min removal count + DFS |
| 34 | Word Break II | 140 | Hard | 🔥🔥 High | Amazon, Google | Recursion + Memoized Partitioning |
| 35 | Parsing A Boolean Expression | 1106 | Hard | 🔥🔥 High | Meta, Amazon, Google | Recursive descent parser |

---

## Phase 8: Google-Level Advanced State & Geometric Backtracking

*Goal: Solve complex multi-pattern problems with physical state, spatial constraints, and extreme pruning.*

| # | Problem | LC# / CSES | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 36 | Robot Room Cleaner | 489 | Hard | 🔥🔥 High | Meta, Amazon, Google | Physical direction turning & undoing |
| 37 | Word Ladder II | 126 | Hard | 🔥🔥 High | Meta, Amazon, Google | BFS Distance Map + DFS Path Reconstruction |
| 38 | Unique Paths III | 980 | Hard | 🔥🔥 High | Meta, Amazon, Google | Hamiltonian Path Grid Backtracking |
| 39 | Tiling a Rectangle with Fewest Squares | 1240 | Hard | 🔥🔥 High | Meta, Amazon, Google | Lowest-cell geometric grid tiling |
| 40 | Grid Paths 48-Step Optimization | CSES 1625 | Hard | 🔥🔥 High | Meta, Amazon, Google | Wall-split and dead-end early pruning |
| 41-50 | Advanced Hybrid Backtracking | Various | Hard | Game tree / Alpha-Beta Pruning / Treap |
