# Dynamic Programming — Top 50 Problems (Intuition-Building Order)
> **How to use this list:** Work through each phase in order.
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

## 🏆 Top 15 Must-Solve Dynamic Programming Problems (Highest Frequency)

If you have limited time before an interview, solve these first:

| Rank | Problem | LC# | Difficulty | Frequency | Top Companies | Core Pattern / Concept |
|---|---|---|---|---|---|---|
| 1 | **Climbing Stairs** | 70 | Easy | 🔥🔥🔥 Very High | Amazon, Google, Meta | Fibonacci variant, dp[i] = ways to reach step i |
| 2 | **House Robber** | 198 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google | Skip/take pattern: dp[i] = max(dp[i-1], dp[i-2]+nums[i]) |
| 3 | **Maximum Subarray** | 53 | Medium | 🔥🔥🔥 Very High | Amazon, Microsoft, Google, LinkedIn | dp[i] = max(nums[i], dp[i-1]+nums[i]), track global max |
| 4 | **Maximum Product Subarray** | 152 | Medium | 🔥🔥🔥 Very High | Amazon, Google, Microsoft | Track both max AND min (negative × negative = positive) |
| 5 | **Best Time to Buy and Sell Stock** | 121 | Easy | 🔥🔥🔥 Very High | Amazon, Meta, Google, Microsoft | Track min price so far, max profit = price - minSoFar |
| 6 | **Coin Change** | 322 | Medium | 🔥🔥🔥 Very High | Amazon, Meta, Google, Microsoft | Min coins: dp[i] = min(dp[i-c]+1), infinity init |
| 7 | **Partition Equal Subset Sum** | 416 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google | Subset sum = total/2, boolean knapsack |
| 8 | **Unique Paths** | 62 | Medium | 🔥🔥🔥 Very High | Amazon, Google, Meta | dp[i][j] = dp[i-1][j] + dp[i][j-1], or combinatorics |
| 9 | **Longest Common Subsequence** | 1143 | Medium | 🔥🔥🔥 Very High | Amazon, Microsoft, Google | Match: dp[i-1][j-1]+1, mismatch: max(dp[i-1][j], dp[i][j-1]) |
| 10 | **Edit Distance** | 72 | Medium | 🔥🔥🔥 Very High | Google, Amazon, Microsoft | Insert/delete/replace: min of 3 neighbors + 1 |
| 11 | **Longest Palindromic Substring** | 5 | Medium | 🔥🔥🔥 Very High | Amazon, Microsoft, Google, Meta | Expand around center O(n²) or interval DP |
| 12 | **Word Break** | 139 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Bloomberg, Google | dp[i] = any j where dp[j] && s[j..i] ∈ dict |
| 13 | **Decode Ways** | 91 | Medium | 🔥🔥🔥 Very High | Meta, Google, Amazon | 1-digit or 2-digit decode, handle '0' carefully |
| 14 | **Longest Increasing Subsequence** | 300 | Medium | 🔥🔥🔥 Very High | Amazon, Google, Microsoft | O(n²) DP or O(n log n) with tails + binary search |
| 15 | **Jump Game** | 55 | Medium | 🔥🔥🔥 Very High | Amazon, Google, Meta | Greedy: track farthest reachable index |


---

## Phase 1: Linear DP Foundations (Master the 1D recurrence)

*Goal: Get comfortable with "state = index, transition = previous states".*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 1 | Fibonacci Number | 509 | Easy | 🔥🔥 High | Amazon, Apple | Pure dp[i] = dp[i-1] + dp[i-2], space-optimize to O(1) |
| 2 | Climbing Stairs | 70 | Easy | 🔥🔥🔥 Very High | Amazon, Google, Meta | Fibonacci variant, dp[i] = ways to reach step i |
| 3 | N-th Tribonacci Number | 1137 | Easy | 🔥 Medium | Amazon | Three previous states instead of two |
| 4 | Min Cost Climbing Stairs | 746 | Easy | 🔥🔥 High | Amazon, Google | Min-cost variant, dp[i] = min(dp[i-1]+c, dp[i-2]+c) |
| 5 | House Robber | 198 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google | Skip/take pattern: dp[i] = max(dp[i-1], dp[i-2]+nums[i]) |
| 6 | House Robber II | 213 | Medium | 🔥🔥 High | Meta, Amazon | Circular: two passes excluding first/last |
| 7 | Delete and Earn | 740 | Medium | 🔥🔥 High | Google, Amazon | Transform to House Robber on sorted values |
| 8 | Counting Bits | 338 | Easy | 🔥🔥 High | Google, Amazon | Bit DP: dp[i] = dp[i>>1] + (i&1) |

---

## Phase 2: Kadane's & Maximum Subarray (Extend or restart)

*Goal: Internalize "either extend the previous subarray or start fresh here".*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 9 | Maximum Subarray | 53 | Medium | 🔥🔥🔥 Very High | Amazon, Microsoft, Google, LinkedIn | dp[i] = max(nums[i], dp[i-1]+nums[i]), track global max |
| 10 | Maximum Product Subarray | 152 | Medium | 🔥🔥🔥 Very High | Amazon, Google, Microsoft | Track both max AND min (negative × negative = positive) |
| 11 | Maximum Sum Circular Subarray | 918 | Medium | 🔥🔥 High | Google, Amazon, Microsoft | max(Kadane's, total - min_subarray), edge: all negative |
| 12 | Best Time to Buy and Sell Stock | 121 | Easy | 🔥🔥🔥 Very High | Amazon, Meta, Google, Microsoft | Track min price so far, max profit = price - minSoFar |

---

## Phase 3: Unbounded Knapsack (Coin Change family)

*Goal: Master "unlimited item usage, iterate capacity FORWARDS".*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 13 | Coin Change | 322 | Medium | 🔥🔥🔥 Very High | Amazon, Meta, Google, Microsoft | Min coins: dp[i] = min(dp[i-c]+1), infinity init |
| 14 | Coin Change II | 518 | Medium | 🔥🔥 High | Amazon, Google | Count ways: coins OUTER to avoid permutation counting |
| 15 | Perfect Squares | 279 | Medium | 🔥🔥 High | Google, Amazon | Min perfect squares summing to n (coin change variant) |
| 16 | Integer Break | 343 | Medium | 🔥🔥 High | Google, Amazon, Microsoft | Max product of parts: dp[i] = max(j×(i-j), j×dp[i-j]) |

---

## Phase 4: 0/1 Knapsack & Subset Sum (Each item used once)

*Goal: Master "iterate capacity BACKWARDS to prevent item reuse".*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 17 | Partition Equal Subset Sum | 416 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google | Subset sum = total/2, boolean knapsack |
| 18 | Target Sum | 494 | Medium | 🔥🔥 High | Meta, Amazon | Algebraic transform to subset sum: P = (total+target)/2 |
| 19 | Last Stone Weight II | 1049 | Medium | 🔥🔥 High | Google, Amazon, Microsoft | Minimize |
| 20 | Ones and Zeroes | 474 | Medium | 🔥🔥 High | Google, Amazon, Microsoft | 2D knapsack: two capacity constraints (zeros, ones) |

---

## Phase 5: Grid DP (2D paths and rectangles)

*Goal: Internalize "dp[i][j] = f(above, left, diagonal)".*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 21 | Unique Paths | 62 | Medium | 🔥🔥🔥 Very High | Amazon, Google, Meta | dp[i][j] = dp[i-1][j] + dp[i][j-1], or combinatorics |
| 22 | Unique Paths II | 63 | Medium | 🔥🔥 High | Amazon, Google | Obstacles: dp[i][j] = 0 if obstacle |
| 23 | Minimum Path Sum | 64 | Medium | 🔥🔥 High | Amazon, Google | dp[i][j] = grid[i][j] + min(above, left) |
| 24 | Triangle | 120 | Medium | 🔥🔥 High | Google, Amazon, Microsoft | Bottom-up: dp[j] = tri[i][j] + min(dp[j], dp[j+1]) |
| 25 | Maximal Square | 221 | Medium | 🔥🔥 High | Google, Amazon | dp[i][j] = min(above, left, diag) + 1 if cell is 1 |

---

## Phase 6: String DP (LCS, Edit Distance, Palindromes)

*Goal: Master "2D table on two strings, match/mismatch transitions".*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 26 | Longest Common Subsequence | 1143 | Medium | 🔥🔥🔥 Very High | Amazon, Microsoft, Google | Match: dp[i-1][j-1]+1, mismatch: max(dp[i-1][j], dp[i][j-1]) |
| 27 | Edit Distance | 72 | Medium | 🔥🔥🔥 Very High | Google, Amazon, Microsoft | Insert/delete/replace: min of 3 neighbors + 1 |
| 28 | Longest Palindromic Substring | 5 | Medium | 🔥🔥🔥 Very High | Amazon, Microsoft, Google, Meta | Expand around center O(n²) or interval DP |
| 29 | Longest Palindromic Subsequence | 516 | Medium | 🔥🔥 High | Amazon, Google | Interval DP: dp[i][j] = dp[i+1][j-1]+2 if match |
| 30 | Interleaving String | 97 | Medium | 🔥🔥 High | Google, Amazon, Microsoft | 2D boolean DP: take from s1 or s2 |

---

## Phase 7: Linear DP with Decisions (Word Break, Decode, LIS)

*Goal: Master "at each position, try all valid choices".*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 31 | Word Break | 139 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Bloomberg, Google | dp[i] = any j where dp[j] && s[j..i] ∈ dict |
| 32 | Decode Ways | 91 | Medium | 🔥🔥🔥 Very High | Meta, Google, Amazon | 1-digit or 2-digit decode, handle '0' carefully |
| 33 | Longest Increasing Subsequence | 300 | Medium | 🔥🔥🔥 Very High | Amazon, Google, Microsoft | O(n²) DP or O(n log n) with tails + binary search |
| 34 | Number of Longest Increasing Subsequence | 673 | Medium | 🔥🔥 High | Google, Amazon, Microsoft | Track both length dp[i] and count[i] |
| 35 | Jump Game | 55 | Medium | 🔥🔥🔥 Very High | Amazon, Google, Meta | Greedy: track farthest reachable index |
| 36 | Jump Game II | 45 | Medium | 🔥🔥🔥 Very High | Amazon, Google, Meta | BFS-style greedy: count levels to reach end |

---

## Phase 8: State Machine DP (Stock Problems)

*Goal: Model multiple states and their transitions per step.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 37 | Best Time Buy/Sell Stock II | 122 | Medium | 🔥🔥🔥 Very High | Amazon, Bloomberg, Meta | Unlimited txns: sum all uphill segments (greedy/DP) |
| 38 | Best Time Buy/Sell Stock with Cooldown | 309 | Medium | 🔥🔥 High | Google, Amazon | 3 states: hold, sold, rest with transitions |
| 39 | Best Time Buy/Sell Stock with Fee | 714 | Medium | 🔥🔥 High | Amazon, Bloomberg | 2 states: hold, cash; subtract fee on sell |
| 40 | Best Time Buy/Sell Stock III | 123 | Hard | 🔥🔥 High | Google, Amazon, Microsoft | At most 2 txns: dp[k][hold/cash] |
| 41 | Best Time Buy/Sell Stock IV | 188 | Hard | 🔥🔥 High | Google, Amazon, Microsoft | At most k txns: generalized state machine |

---

## Phase 9: Interval DP & Game Theory (Range-based subproblems)

*Goal: Master "try all split points k in [i, j], iterate by range length".*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 42 | Palindrome Partitioning II | 132 | Hard | 🔥🔥 High | Google, Amazon, Microsoft | Min cuts: expand + update dp, or 2D palindrome check |
| 43 | Burst Balloons | 312 | Hard | 🔥🔥 High | Google, Amazon | Reverse thinking: which balloon to burst LAST in [i,j] |
| 44 | Stone Game | 877 | Medium | 🔥🔥 High | Google, Amazon, Microsoft | Score diff DP: dp[i][j] = max(take_left, take_right) |
| 45 | Stone Game III | 1406 | Hard | 🔥🔥 High | Google, Amazon, Microsoft | Take 1-3 piles: dp[i] = max score diff from pile i |
| 46 | Minimum Cost Tree From Leaf Values | 1130 | Medium | 🔥🔥 High | Google, Amazon, Microsoft | Interval DP or greedy with stack |

---

## Phase 10: Advanced / Multi-Technique (Google-Level)

*Goal: Combine DP with other patterns (sorting, binary search, graphs, bitmask).*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 47 | Longest String Chain | 1048 | Medium | 🔥🔥 High | Google, Amazon, Microsoft | Sort by length + HashMap DP (LIS variant) |
| 48 | Longest Arithmetic Subsequence | 1027 | Medium | 🔥🔥 High | Google, Amazon, Microsoft | dp[i][diff] = length, HashMap per index |
| 49 | Maximum Profit in Job Scheduling | 1235 | Hard | 🔥🔥 High | Google, Amazon, Microsoft | Sort by end time + binary search + dp |
| 50 | Distinct Subsequences | 115 | Hard | 🔥🔥 High | Google, Amazon, Microsoft | String DP: count ways to form t from s |

---

## Study Roadmap

```
Tier 1 Sprint (Emergency FAANG Prep):
  Focus exclusively on 🔥🔥🔥 (Very High) problems in the Top list above.

Complete Roadmap (Intuition-Building):

```
Week 1 (Days 1-2):  Phase 1 — Linear DP foundations (#1-#8)
Week 1 (Days 3-4):  Phase 2 — Kadane's (#9-#12)
Week 1 (Day 5):     Phase 3 — Unbounded Knapsack (#13-#16)
Week 2 (Days 1-2):  Phase 4 — 0/1 Knapsack (#17-#20)
Week 2 (Days 3-4):  Phase 5 — Grid DP (#21-#25)
Week 2 (Day 5):     Phase 6 — String DP (#26-#30)
Week 3 (Days 1-2):  Phase 7 — Decision DP (#31-#36)
Week 3 (Day 3):     Phase 8 — State Machine (#37-#41)
Week 3 (Days 4-5):  Phase 9 — Interval DP (#42-#46)
Week 4 (Days 1-2):  Phase 10 — Advanced (#47-#50)
```

### How to Practice Each Problem

```
1. Read the problem. Classify it (linear/knapsack/grid/string/interval).
2. DEFINE THE STATE in one sentence: "dp[i] represents..."
3. WRITE THE TRANSITION before coding: dp[i] = f(...)
4. IDENTIFY BASE CASES: dp[0] = ?, dp[1] = ?
5. Code the brute force (top-down with memo).
6. Convert to bottom-up tabulation.
7. Space-optimize if possible.
8. Verify: can you explain the time complexity in one sentence?
9. Do the follow-ups — they build deeper intuition.
```

---

## Quick Pattern Checklist (Before Coding)

- [ ] Does it have **optimal substructure** (optimal solution uses optimal subproblems)?
- [ ] Does it have **overlapping subproblems** (same subproblem solved repeatedly)?
- [ ] Is it a **counting** problem (ways) or **optimization** (min/max)?
- [ ] Is it **1D** (linear), **2D** (grid/strings), or **interval** (ranges)?
- [ ] Is it **knapsack**? → 0/1 (backwards) or unbounded (forwards)?
- [ ] Does it involve **two strings**? → 2D table, match vs mismatch
- [ ] Is it a **game**? → Interval DP with score difference
- [ ] Can I **space-optimize**? → Check which previous states are needed
- [ ] Does the **greedy choice** always work? → If yes, skip DP
