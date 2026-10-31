# Two Pointers — Top 50 Problems (Intuition-Building Order)
> **How to use this list:** Work through each section in order.
> Each section builds on the previous one. Don't skip ahead until the pattern clicks.
> Use the **Interview Frequency** column to prioritize must-solve problems for upcoming FAANG/Tier-1 interviews.

---

## 📊 Interview Frequency Legend

| Tier | Badge | Interview Frequency | Description | Target Companies |
|---|---|---|---|---|
| **Tier 1** | 🔥🔥🔥 **Very High** | Appears in >70% of candidate question pools | Absolute must-solve before any interview | Meta, Google, Amazon, Microsoft, Apple, Bloomberg |
| **Tier 2** | 🔥🔥 **High** | Core interview standard (35%–70%) | Regular interview staple; tests pattern variation fluency | Amazon, Google, Meta, Uber, ByteDance |
| **Tier 3** | 🔥 **Medium** | Follow-up / classic variant (<35%) | Tests edge cases, extensions, and deeper mathematical insight | Top tech phone screens & online assessments |

---

## 🏆 Top 15 Must-Solve Two Pointers Problems (Highest Frequency)

If you have limited time before an interview, solve these first:

| Rank | Problem | LC# | Difficulty | Frequency | Top Companies | Core Pattern / Concept |
|---|---|---|---|---|---|---|
| 1 | **Two Sum II — Input Array Is Sorted** | 167 | Easy | 🔥🔥🔥 Very High | Amazon, Google, Apple | Sorted → monotonic → squeeze inward |
| 2 | **Valid Palindrome** | 125 | Easy | 🔥🔥🔥 Very High | Meta, Microsoft, Amazon | Skip non-alphanum, opposite-end compare |
| 3 | **Container With Most Water** | 11 | Medium | 🔥🔥🔥 Very High | Amazon, Google, Meta, Adobe | Move the shorter height pointer; greedy proof |
| 4 | **Remove Duplicates from Sorted Array** | 26 | Easy | 🔥🔥🔥 Very High | Meta, Amazon, Microsoft | Write unique elements only |
| 5 | **Move Zeroes** | 283 | Easy | 🔥🔥🔥 Very High | Meta, Amazon, Apple, Microsoft | Write non-zeros, fill rest with zeros |
| 6 | **Sort Colors** | 75 | Medium | 🔥🔥🔥 Very High | Microsoft, Amazon, Meta, Google | Dutch National Flag: 3-way partition in one pass |
| 7 | **Linked List Cycle** | 141 | Easy | 🔥🔥🔥 Very High | Amazon, Microsoft, Meta | fast/slow meet iff cycle |
| 8 | **Remove Nth Node From End of List** | 19 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Apple | Gap-of-n+1 between fast and slow |
| 9 | **Reorder List** | 143 | Medium | 🔥🔥🔥 Very High | Meta, Amazon | Find mid + reverse + merge (3 sub-problems) |
| 10 | **Two Sum (sorted) — revisit** | 167 | Easy | 🔥🔥🔥 Very High | Amazon, Google, Apple | Base case for kSum recursion |
| 11 | **3Sum** | 15 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google, Microsoft, Apple | Fix one + two-pointer; 3 levels of dup-skip |
| 12 | **Merge Sorted Array** | 88 | Easy | 🔥🔥🔥 Very High | Meta, Microsoft, Amazon | Fill right-to-left from largest |
| 13 | **Trapping Rain Water** | 42 | Hard | 🔥🔥🔥 Very High | Google, Amazon, Meta, Goldman Sachs | Track maxLeft/maxRight; process the min-boundary side |
| 14 | **Valid Palindrome II (one deletion)** | 680 | Medium | 🔥🔥🔥 Very High | Meta, Amazon | Two pointers + try skip left or skip right |
| 15 | **Reverse String** | 344 | Easy | 🔥🔥 High | Apple, Amazon | Symmetric swap, simplest opposite-end |


---

## Phase 1: Opposite-End Basics (Squeeze Inward on Sorted Array)

*Goal: Master the "squeeze inward" mechanic. Understand WHY we always move the smaller/larger side.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 1 | Two Sum II — Input Array Is Sorted | 167 | Easy | 🔥🔥🔥 Very High | Amazon, Google, Apple | Sorted → monotonic → squeeze inward |
| 2 | Reverse String | 344 | Easy | 🔥🔥 High | Apple, Amazon | Symmetric swap, simplest opposite-end |
| 3 | Valid Palindrome | 125 | Easy | 🔥🔥🔥 Very High | Meta, Microsoft, Amazon | Skip non-alphanum, opposite-end compare |
| 4 | Squares of a Sorted Array | 977 | Easy | 🔥🔥 High | Meta, Amazon, Google | Fill result right-to-left, compare absolute values |
| 5 | Reverse Vowels of a String | 345 | Easy | 🔥 Medium | Google, Apple | Skip consonants, swap vowels only |
| 6 | Reverse Words in a String III | 557 | Easy | 🔥 Medium | Amazon, Microsoft | Reverse each word using opposite-end |
| 7 | Is Subsequence | 392 | Easy | 🔥🔥 High | Google, Amazon | One pointer per string, advance match pointer |
| 8 | Container With Most Water | 11 | Medium | 🔥🔥🔥 Very High | Amazon, Google, Meta, Adobe | Move the shorter height pointer; greedy proof |

---

## Phase 2: Same-Direction — Read/Write (In-Place Modification)

*Goal: Internalize "slow = write head, fast = read head" pattern.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 9 | Remove Element | 27 | Easy | 🔥🔥 High | Amazon, Google | Copy non-val elements to write head |
| 10 | Remove Duplicates from Sorted Array | 26 | Easy | 🔥🔥🔥 Very High | Meta, Amazon, Microsoft | Write unique elements only |
| 11 | Move Zeroes | 283 | Easy | 🔥🔥🔥 Very High | Meta, Amazon, Apple, Microsoft | Write non-zeros, fill rest with zeros |
| 12 | Remove Duplicates from Sorted Array II | 80 | Medium | 🔥🔥 High | Meta, Amazon | Allow at most 2 — compare nums[fast] with nums[slow-2] |
| 13 | Remove Duplicates from Sorted List | 83 | Easy | 🔥🔥 High | Amazon, Microsoft | Linked list version: skip duplicate nodes |
| 14 | Remove Duplicates from Sorted List II | 82 | Medium | 🔥🔥 High | Amazon, Meta | Remove ALL nodes with duplicate values |
| 15 | Partition Array (even before odd) | — | Easy | 🔥 Medium | Meta, Amazon, Google | Write evens first, then odds |
| 16 | Compress String (LC 443) | 443 | Medium | 🔥🔥 High | Microsoft, Amazon, Goldman Sachs | Read/write pointers for run-length encoding |

---

## Phase 3: Three Pointers — Dutch National Flag & Partitions

*Goal: Master 3-way partition invariants. Know WHY mid doesn't advance after swap with high.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 17 | Sort Colors | 75 | Medium | 🔥🔥🔥 Very High | Microsoft, Amazon, Meta, Google | Dutch National Flag: 3-way partition in one pass |
| 18 | Partition Array into Three Parts With Equal Sum | 1051 | Easy | 🔥 Medium | Google | 3-group partition (greedy, not exactly DNF but related) |
| 19 | 3-way partition by pivot | — | Medium | 🔥🔥 High | Meta, Amazon, Google | Quicksort partition subroutine (DNF variant) |
| 20 | Wiggle Sort II | 324 | Medium | 🔥🔥 High | Meta, Amazon, Google | Median-of-medians + 3-way partition + reindex |

---

## Phase 4: Fast/Slow Pointers — Linked Lists

*Goal: Master Floyd's cycle algorithm (2-phase). Understand the math for cycle start detection.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 21 | Linked List Cycle | 141 | Easy | 🔥🔥🔥 Very High | Amazon, Microsoft, Meta | fast/slow meet iff cycle |
| 22 | Linked List Cycle II — Find Start | 142 | Medium | 🔥🔥 High | Amazon, Microsoft | Floyd phase 2: reset slow to head |
| 23 | Middle of the Linked List | 876 | Easy | 🔥🔥 High | Amazon, Google | fast.next.next stops when fast.next == null |
| 24 | Remove Nth Node From End of List | 19 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Apple | Gap-of-n+1 between fast and slow |
| 25 | Palindrome Linked List | 234 | Easy | 🔥🔥 High | Meta, Amazon | Find mid + reverse second half + compare |
| 26 | Reorder List | 143 | Medium | 🔥🔥🔥 Very High | Meta, Amazon | Find mid + reverse + merge (3 sub-problems) |
| 27 | Rotate List | 61 | Medium | 🔥🔥 High | Amazon, Bloomberg | Find length + k-th from end connection |
| 28 | Happy Number | 202 | Easy | 🔥🔥 High | Amazon, Apple, Uber | Cycle detection on "digit square sum" sequence |

---

## Phase 5: kSum — Fix Outer + Two-Pointer Inner

*Goal: Master duplicate skipping at EVERY level. Understand bulk-count optimization.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 29 | Two Sum (sorted) — revisit | 167 | Easy | 🔥🔥🔥 Very High | Amazon, Google, Apple | Base case for kSum recursion |
| 30 | 3Sum | 15 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google, Microsoft, Apple | Fix one + two-pointer; 3 levels of dup-skip |
| 31 | 3Sum Closest | 16 | Medium | 🔥🔥 High | Amazon, Bloomberg, Meta | Track closest; no dup-skip needed |
| 32 | 3Sum Smaller (count) | 259 | Medium | 🔥 Medium | Google, Amazon | Count += (right - left) on valid; bulk counting |
| 33 | 4Sum | 18 | Medium | 🔥 Medium | Amazon, Apple | Fix two + two-pointer; overflow with long |
| 34 | 4Sum II (count) | 454 | Medium | 🔥 Medium | Amazon, Google | HashMap on two-pair sums (not two-pointer) |
| 35 | kSum (general) | — | Hard | 🔥🔥 High | Meta, Amazon, Google | Recursive: reduce kSum to (k-1)Sum; base case = 2Sum |

---

## Phase 6: Merge / Cross-Array Two Pointers

*Goal: Use one pointer per array, advance the smaller to eliminate dominated elements.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 36 | Merge Sorted Array | 88 | Easy | 🔥🔥🔥 Very High | Meta, Microsoft, Amazon | Fill right-to-left from largest |
| 37 | Intersection of Two Arrays II | 350 | Easy | 🔥🔥 High | Meta, Amazon | Sort both + advance smaller |
| 38 | Find Common Characters | 1002 | Easy | 🔥 Medium | Amazon, Apple | Frequency min across arrays |
| 39 | Smallest Difference (pair from two arrays) | — | Medium | 🔥🔥 High | Meta, Amazon, Google | Sort both + two-pointer cross-array |
| 40 | Find K Pairs with Smallest Sums | 373 | Medium | 🔥🔥 High | Meta, Amazon, Google | MinHeap preferred; two-pointer gives intuition |

---

## Phase 7: Greedy + Two Pointers (Non-Obvious Applications)

*Goal: Combine sorting insight with two-pointer to solve optimization problems.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 41 | Trapping Rain Water | 42 | Hard | 🔥🔥🔥 Very High | Google, Amazon, Meta, Goldman Sachs | Track maxLeft/maxRight; process the min-boundary side |
| 42 | Minimize Maximum Pair Sum in Array | 1877 | Medium | 🔥 Medium | Amazon | Sort + pair smallest with largest |
| 43 | Minimum Moves to Seat Everyone | 2037 | Easy | 🔥 Medium | Amazon | Sort both + pair by index |
| 44 | Boats to Save People | 881 | Medium | 🔥🔥 High | Amazon, Google | Sort + opposite-end; greedy pair heaviest with lightest |
| 45 | Advantage Shuffle (LC 870) | 870 | Medium | 🔥 Medium | Google, Amazon | Sort both + greedy matching |
| 46 | Maximum Erasure Value (max subarray of unique elements) | 1695 | Medium | 🔥🔥 High | Amazon, Meta | Sliding window (two-pointer variant with HashSet) |

---

## Phase 8: Advanced / Multi-Technique (Google-Level)

*Goal: Two pointers as a subroutine inside DP, bitmask, binary search, or greedy frameworks.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 47 | Valid Palindrome II (one deletion) | 680 | Medium | 🔥🔥🔥 Very High | Meta, Amazon | Two pointers + try skip left or skip right |
| 48 | Palindrome Pairs | 336 | Hard | 🔥🔥 High | Meta, Amazon, Google | Trie / HashMap + two-pointer palindrome check |
| 49 | Maximum Score of a Good Subarray | 1793 | Hard | 🔥🔥 High | Google, ByteDance | Expand from fixed k, greedy larger-side expansion |
| 50 | Minimum Operations to Make Array Continuous | 2009 | Hard | 🔥🔥 High | Google, Meta | Sort + deduplicate + sliding two-pointer window |

---

## Study Roadmap

```
Tier 1 Sprint (Emergency FAANG Prep):
  Focus exclusively on 🔥🔥🔥 (Very High) problems in the Top list above.

Complete Roadmap (Intuition-Building):
Week 1 (Days 1-2):  Phase 1 — Opposite-end basics (#1-#8)
Week 1 (Days 3-4):  Phase 2 — Read/write in-place (#9-#16)
Week 1 (Day 5):     Phase 3 — Dutch National Flag (#17-#20)
Week 2 (Days 1-3):  Phase 4 — Fast/slow linked list (#21-#28)
Week 2 (Days 4-5):  Phase 5 — kSum family (#29-#35)
Week 3 (Days 1-2):  Phase 6 — Merge/cross-array (#36-#40)
Week 3 (Days 3-4):  Phase 7 — Greedy + two pointers (#41-#46)
Week 3 (Day 5):     Phase 8 — Advanced / Google-level (#47-#50)
```

### How to Practice Each Problem

```
1. Read the problem. Classify it (which template?).
2. Write the brute force and its complexity.
3. Identify the monotonicity / invariant that enables two pointers.
4. Apply the correct template from 00_theory.md.
5. Code optimal solution WITHOUT hints.
6. Can you explain in one sentence WHY it's O(n)?
7. Do the follow-ups — they reveal edge cases and deeper insight.
```

---

## Quick Pattern Checklist (Before Coding)

- [ ] Is the array **sorted** (or can I sort without losing needed info)?
- [ ] Am I looking for **pairs / triplets** satisfying a constraint?
  - [ ] If YES → Opposite-end or Fix + Two-Pointer
- [ ] Am I **modifying the array in-place** (remove, filter, partition)?
  - [ ] If YES → Same-direction read/write
- [ ] Is this a **linked list** with cycle or midpoint?
  - [ ] If YES → Fast/Slow
- [ ] Do I need **3-way partition** (e.g., sort 0/1/2)?
  - [ ] If YES → Dutch National Flag
- [ ] Is the result about **contiguous subarrays** (not pairs)?
  - [ ] If YES → Sliding Window (NOT two pointers)
- [ ] Can elements **overflow int** when summed?
  - [ ] If YES → Cast to long before arithmetic
