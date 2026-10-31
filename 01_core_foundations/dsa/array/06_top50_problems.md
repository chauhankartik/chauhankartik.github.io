# Arrays — Top 50 Problems (Intuition-Building Order)
> **How to use this list:** Work through each section in order.
> Each phase builds on the previous one. Master the pattern before moving on.
> Use the **Interview Frequency** column to prioritize must-solve problems for upcoming FAANG/Tier-1 interviews.

---

## 📊 Interview Frequency Legend

| Tier | Badge | Interview Frequency | Description | Target Companies |
|---|---|---|---|---|
| **Tier 1** | 🔥🔥🔥 **Very High** | Appears in >70% of candidate question pools | Absolute must-solve before any interview | Meta, Google, Amazon, Microsoft, Apple, Bloomberg |
| **Tier 2** | 🔥🔥 **High** | Core interview standard (35%–70%) | Regular interview staple; tests pattern variation fluency | Amazon, Google, Meta, Uber, ByteDance |
| **Tier 3** | 🔥 **Medium** | Follow-up / classic variant (<35%) | Tests edge cases, extensions, and deeper mathematical insight | Top tech phone screens & online assessments |

---

## 🏆 Top 15 Must-Solve Array Problems (Highest Frequency)

If you have limited time before an interview, solve these 15 first:

| Rank | Problem | LC# | Difficulty | Frequency | Top Companies | Core Pattern |
|---|---|---|---|---|---|---|
| 1 | **Best Time to Buy and Sell Stock** | 121 | Easy | 🔥🔥🔥 Very High | Amazon, Meta, Google, Microsoft, Citadel | Running Minimum (Kadane variant) |
| 2 | **Two Sum II (sorted)** | 167 | Medium | 🔥🔥🔥 Very High | Amazon, Google, Apple, Bloomberg | Two Pointers (Opposite ends) |
| 3 | **3Sum** | 15 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google, Microsoft, Apple | Sort + Two Pointers |
| 4 | **Product of Array Except Self** | 238 | Medium | 🔥🔥🔥 Very High | Amazon, Meta, Google, Apple, Microsoft | Prefix & Suffix Products |
| 5 | **Subarray Sum Equals K** | 560 | Medium | 🔥🔥🔥 Very High | Meta, Google, Amazon, Microsoft | Prefix Sum + HashMap |
| 6 | **Maximum Subarray** | 53 | Medium | 🔥🔥🔥 Very High | Amazon, Microsoft, Google, LinkedIn | Kadane's Algorithm |
| 7 | **Trapping Rain Water** | 42 | Hard | 🔥🔥🔥 Very High | Google, Amazon, Meta, Goldman Sachs | Two Pointers / Prefix Max |
| 8 | **Merge Intervals** | 56 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google, Microsoft, Bloomberg | Sort + Linear Sweep |
| 9 | **Search in Rotated Sorted Array** | 33 | Medium | 🔥🔥🔥 Very High | Amazon, Meta, Google, Microsoft, Apple | Binary Search on Modified Halves |
| 10 | **Container With Most Water** | 11 | Medium | 🔥🔥🔥 Very High | Amazon, Google, Meta, Adobe | Two Pointers (Greedy shrink) |
| 11 | **Move Zeroes** | 283 | Easy | 🔥🔥🔥 Very High | Meta, Amazon, Apple, Microsoft | Two Pointers (In-place write) |
| 12 | **Next Permutation** | 31 | Medium | 🔥🔥🔥 Very High | Meta, Google, Amazon, Bloomberg | Lexicographic Algorithm |
| 13 | **Spiral Matrix** | 54 | Medium | 🔥🔥🔥 Very High | Microsoft, Amazon, Apple, Google | Boundary Simulation (4 pointers) |
| 14 | **First Missing Positive** | 41 | Hard | 🔥🔥🔥 Very High | Amazon, Microsoft, Google, Meta | Cyclic Sort (In-place indexing) |
| 15 | **Median of Two Sorted Arrays** | 4 | Hard | 🔥🔥🔥 Very High | Google, Amazon, Microsoft, Goldman Sachs | Binary Search on Partition |

---

## Phase 1: Two Pointers — Opposite Ends (Sorted array fundamentals)

*Goal: Use sorted order to eliminate brute-force pair scanning.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 1 | Two Sum II (sorted) | 167 | Medium | 🔥🔥🔥 Very High | Amazon, Google, Apple | Left/right pointers converge on target |
| 2 | Valid Palindrome | 125 | Easy | 🔥🔥🔥 Very High | Meta, Microsoft, Amazon | Two pointers from both ends |
| 3 | Container With Most Water | 11 | Medium | 🔥🔥🔥 Very High | Amazon, Google, Meta, Adobe | Greedy: move the shorter side |
| 4 | 3Sum | 15 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google, Microsoft | Sort + fix one + two pointers |
| 5 | 3Sum Closest | 16 | Medium | 🔥 Medium | Amazon, Bloomberg, Meta | Same structure, track closest |
| 6 | Trapping Rain Water | 42 | Hard | 🔥🔥🔥 Very High | Google, Amazon, Meta, Goldman Sachs | Two pointers with leftMax/rightMax |
| 7 | 4Sum | 18 | Medium | 🔥 Medium | Amazon, Apple | Fix two + two pointers |

---

## Phase 2: Two Pointers — Same Direction (In-place write / partition)

*Goal: Master the slow/fast pointer technique for in-place array mutation.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 8 | Remove Duplicates from Sorted Array | 26 | Easy | 🔥🔥🔥 Very High | Meta, Amazon, Microsoft | Slow=write, fast=read |
| 9 | Remove Duplicates II (allow 2) | 80 | Medium | 🔥🔥 High | Meta, Amazon | Generalize: check slow-2 |
| 10 | Remove Element | 27 | Easy | 🔥🔥 High | Amazon, Google | Skip target values |
| 11 | Move Zeroes | 283 | Easy | 🔥🔥🔥 Very High | Meta, Amazon, Apple, Microsoft | Swap non-zeros forward |
| 12 | Sort Colors (Dutch National Flag) | 75 | Medium | 🔥🔥🔥 Very High | Microsoft, Amazon, Meta, Google | 3-way partition with 3 pointers |
| 13 | Merge Sorted Array | 88 | Easy | 🔥🔥🔥 Very High | Meta, Microsoft, Amazon | Merge from the END to avoid overwrites |
| 14 | Squares of a Sorted Array | 977 | Easy | 🔥🔥 High | Meta, Amazon, Google | Two pointers from both ends → result from back |

---

## Phase 3: Prefix Sum / Product

*Goal: Precompute cumulative values for O(1) range queries.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 15 | Running Sum of 1D Array | 1480 | Easy | 🔥🔥 High | Amazon, Apple | Simplest prefix sum |
| 16 | Product of Array Except Self | 238 | Medium | 🔥🔥🔥 Very High | Amazon, Meta, Google, Apple | Prefix product × suffix product, no division |
| 17 | Subarray Sum Equals K | 560 | Medium | 🔥🔥🔥 Very High | Meta, Google, Amazon, Microsoft | Prefix sum + HashMap (count complements) |
| 18 | Contiguous Array | 525 | Medium | 🔥🔥 High | Amazon, Google, Meta | Transform 0→-1, prefix sum + first-seen index |
| 19 | Range Sum Query (Immutable) | 303 | Easy | 🔥 Medium | Amazon, Meta | Prefix array, sum(l,r) = p[r+1] - p[l] |
| 20 | Range Sum Query 2D (Immutable) | 304 | Medium | 🔥🔥 High | Meta, Amazon, Google | 2D prefix sum with inclusion-exclusion |

---

## Phase 4: Kadane's Algorithm (Maximum subarray)

*Goal: "Extend or restart?" — the core DP-on-subarrays insight.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 21 | Maximum Subarray | 53 | Medium | 🔥🔥🔥 Very High | Amazon, Microsoft, Google, LinkedIn | Classic Kadane's |
| 22 | Maximum Subarray Sum Circular | 918 | Medium | 🔥🔥 High | Amazon, Microsoft, Google | max(Kadane, total - minKadane) |
| 23 | Maximum Product Subarray | 152 | Medium | 🔥🔥🔥 Very High | Amazon, Google, Microsoft | Track both max AND min (neg×neg) |
| 24 | Best Time to Buy and Sell Stock | 121 | Easy | 🔥🔥🔥 Very High | Amazon, Meta, Google, Microsoft, Citadel | Running minimum (Kadane variant) |
| 25 | Best Time to Buy and Sell Stock II | 122 | Medium | 🔥🔥🔥 Very High | Amazon, Bloomberg, Meta | Greedy: sum all positive diffs |

---

## Phase 5: Binary Search on Arrays

*Goal: Apply binary search beyond simple "find element".*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 26 | Binary Search | 704 | Easy | 🔥🔥🔥 Very High | Microsoft, Apple, Google | Standard template |
| 27 | Search Insert Position | 35 | Easy | 🔥🔥 High | Google, Amazon, Apple | Lower bound / insertion point |
| 28 | Find First and Last Position | 34 | Medium | 🔥🔥🔥 Very High | Meta, Google, Amazon, Bloomberg | Two binary searches (leftmost + rightmost) |
| 29 | Search in Rotated Sorted Array | 33 | Medium | 🔥🔥🔥 Very High | Amazon, Meta, Google, Microsoft | Identify sorted half, search accordingly |
| 30 | Find Minimum in Rotated Sorted Array | 153 | Medium | 🔥🔥🔥 Very High | Amazon, Meta, Microsoft | Binary search on rotation point |
| 31 | Koko Eating Bananas | 875 | Medium | 🔥🔥🔥 Very High | Google, Airbnb, Amazon, Meta | Binary search on answer (isFeasible check) |
| 32 | Split Array Largest Sum | 410 | Hard | 🔥🔥 High | Google, Amazon, ByteDance | Binary search on answer + greedy validation |

---

## Phase 6: Interval Problems (Sort + sweep)

*Goal: Sort by start/end, then linear pass to merge/count.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 33 | Merge Intervals | 56 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google, Microsoft | Sort by start, extend or new interval |
| 34 | Insert Interval | 57 | Medium | 🔥🔥🔥 Very High | Google, Meta, Amazon | Three-phase: before, overlapping, after |
| 35 | Non-overlapping Intervals | 435 | Medium | 🔥🔥 High | Meta, Amazon, Google | Sort by end, greedy removal |
| 36 | Meeting Rooms | 252 | Easy | 🔥🔥🔥 Very High | Amazon, Meta, Google, Microsoft | Sort + check any overlap |
| 37 | Meeting Rooms II | 253 | Medium | 🔥🔥🔥 Very High | Amazon, Meta, Google, Bloomberg, Uber | Min-heap for end times or sweep line |
| 38 | Minimum Number of Arrows to Burst Balloons | 452 | Medium | 🔥🔥 High | Amazon, Google, Meta | Sort by end, greedy (same as #35) |

---

## Phase 7: Matrix Traversal

*Goal: Master boundary tracking and spiral/diagonal patterns.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 39 | Spiral Matrix | 54 | Medium | 🔥🔥🔥 Very High | Microsoft, Amazon, Apple, Google | 4-boundary simulation |
| 40 | Rotate Image | 48 | Medium | 🔥🔥🔥 Very High | Amazon, Microsoft, Cisco, Google | Transpose + reverse rows |
| 41 | Set Matrix Zeroes | 73 | Medium | 🔥🔥🔥 Very High | Amazon, Microsoft, Meta | Use first row/col as markers |
| 42 | Search a 2D Matrix | 74 | Medium | 🔥🔥🔥 Very High | Amazon, Microsoft, Bloomberg | Treat as 1D sorted array |
| 43 | Search a 2D Matrix II | 240 | Medium | 🔥🔥 High | Amazon, Microsoft, Google | Start from top-right corner |

---

## Phase 8: Advanced / Google-Level

*Goal: Combine multiple patterns, handle edge cases.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 44 | First Missing Positive | 41 | Hard | 🔥🔥🔥 Very High | Amazon, Microsoft, Google, Meta | Cyclic sort: place nums[i] at index nums[i]-1 |
| 45 | Median of Two Sorted Arrays | 4 | Hard | 🔥🔥🔥 Very High | Google, Amazon, Microsoft, Apple | Binary search on partition |
| 46 | Next Permutation | 31 | Medium | 🔥🔥🔥 Very High | Meta, Google, Amazon, Microsoft | Lexicographic algorithm |
| 47 | Longest Increasing Subsequence | 300 | Medium | 🔥🔥🔥 Very High | Amazon, Google, Microsoft | DP + binary search (patience sort) |
| 48 | Longest Consecutive Sequence | 128 | Medium | 🔥🔥🔥 Very High | Google, Amazon, Meta, Spotify | HashSet + "start only at true start" |
| 49 | Majority Element | 169 | Easy | 🔥🔥🔥 Very High | Amazon, Google, Meta, Microsoft | Boyer-Moore voting |
| 50 | Majority Element II | 229 | Medium | 🔥🔥 High | Amazon, Google | Extended Boyer-Moore (at most 2 candidates) |

---

## Study Roadmap

```
Tier 1 Sprint (Emergency FAANG Prep):
  Focus exclusively on 🔥🔥🔥 (Very High) problems in the Top 15 list above.

Complete Roadmap (Intuition-Building):
  Week 1 (Days 1-3):  Phase 1-2 — Two pointers (#1-#14)
  Week 1 (Days 4-5):  Phase 3 — Prefix sum (#15-#20)
  Week 2 (Days 1-2):  Phase 4 — Kadane's (#21-#25)
  Week 2 (Days 3-4):  Phase 5 — Binary search (#26-#32)
  Week 2 (Day 5):     Phase 6 — Intervals (#33-#38)
  Week 3 (Days 1-2):  Phase 7 — Matrix (#39-#43)
  Week 3 (Days 3-5):  Phase 8 — Advanced (#44-#50)
```
