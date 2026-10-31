# Greedy Algorithms — Top 50 Problems (Intuition-Building Order)
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

## 🏆 Top 15 Must-Solve Greedy Algorithms Problems (Highest Frequency)

If you have limited time before an interview, solve these first:

| Rank | Problem | LC# | Difficulty | Frequency | Top Companies | Core Pattern / Concept |
|---|---|---|---|---|---|---|
| 1 | **Meeting Rooms I** | 252 | Easy | 🔥🔥🔥 Very High | Amazon, Meta, Google | Sort by start time, check overlap |
| 2 | **Meeting Rooms II** | 253 | Medium | 🔥🔥🔥 Very High | Amazon, Meta, Google, Bloomberg | Min-Heap or Chronological sweep |
| 3 | **Jump Game I** | 55 | Medium | 🔥🔥🔥 Very High | Amazon, Google, Meta | Track maxReach boundary |
| 4 | **Jump Game II** | 45 | Medium | 🔥🔥🔥 Very High | Amazon, Google, Meta | BFS / Level boundary jumping |
| 5 | **Gas Station** | 134 / IB | Medium | 🔥🔥🔥 Very High | Amazon, Google, Meta | Single pass range elimination |
| 6 | **Task Scheduler** | 621 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google | Frequency slots / Max-Heap eviction |
| 7 | **Candy** | 135 / IB | Hard | 🔥🔥🔥 Very High | Google, Amazon, Microsoft | Left pass + Right pass combining |
| 8 | **Trapping Rain Water** | 42 | Hard | 🔥🔥🔥 Very High | Google, Amazon, Meta, Goldman Sachs | Left max + Right max / Two pointers |
| 9 | **Majority Element** | 169 / IB | Easy | 🔥🔥🔥 Very High | Amazon, Google, Meta, Microsoft | Boyer-Moore Candidate Elimination |
| 10 | **Maximum Units on a Truck** | 1710 | Easy | 🔥🔥 High | Amazon, Apple | Sort by unit yield descending |
| 11 | **Can Place Flowers** | 605 | Easy | 🔥🔥 High | Meta, Amazon | Local non-adjacent placement check |
| 12 | **Non-overlapping Intervals** | 435 | Medium | 🔥🔥 High | Meta, Amazon, Google | Sort by end time, eliminate overlaps |
| 13 | **Minimum Number of Arrows to Burst Balloons** | 452 | Medium | 🔥🔥 High | Amazon, Google, Meta | Sort by end coordinate, count arrows |
| 14 | **Merge Intervals** | 56 | Medium | 🔥🔥 High | Amazon, Google, Meta | Sort by start time, merge overlapping |
| 15 | **Insert Interval** | 57 | Medium | 🔥🔥 High | Amazon, Google, Meta | Single-pass insertion & merge |


---

## Phase 1: Simple Sorting & Single Pass (Foundations)

*Goal: Get comfortable with sorting by a single attribute and taking elements greedily.*

| # | Problem | LC# / IB | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 1 | Assign Cookies | 455 | Easy | 🔥 Medium | Amazon | Two-pointer greedy matching |
| 2 | Maximum Units on a Truck | 1710 | Easy | 🔥🔥 High | Amazon, Apple | Sort by unit yield descending |
| 3 | Array Partition I | 561 | Easy | 🔥 Medium | Apple, Amazon | Pair adjacent elements after sort |
| 4 | Minimum Operations to Make Array Increasing | 1827 | Easy | 🔥 Medium | Amazon | Single pass strictly increasing adjustment |
| 5 | Largest Number After Digit Swaps by Parity | 2231 | Easy | 🔥 Medium | Google | Separate odd/even digits and place largest |
| 6 | Maximum Sum After K Negations | 1005 | Easy | 🔥 Medium | Amazon | Sort, negate negative values, handle odd K |
| 7 | Can Place Flowers | 605 | Easy | 🔥🔥 High | Meta, Amazon | Local non-adjacent placement check |

---

## Phase 2: Interval Scheduling & Overlaps

*Goal: Master sorting by end-times vs start-times for interval problems.*

| # | Problem | LC# / IB | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 8 | Non-overlapping Intervals | 435 | Medium | 🔥🔥 High | Meta, Amazon, Google | Sort by end time, eliminate overlaps |
| 9 | Minimum Number of Arrows to Burst Balloons | 452 | Medium | 🔥🔥 High | Amazon, Google, Meta | Sort by end coordinate, count arrows |
| 10 | Merge Intervals | 56 | Medium | 🔥🔥 High | Amazon, Google, Meta | Sort by start time, merge overlapping |
| 11 | Insert Interval | 57 | Medium | 🔥🔥 High | Amazon, Google, Meta | Single-pass insertion & merge |
| 12 | Meeting Rooms I | 252 | Easy | 🔥🔥🔥 Very High | Amazon, Meta, Google | Sort by start time, check overlap |
| 13 | Meeting Rooms II | 253 | Medium | 🔥🔥🔥 Very High | Amazon, Meta, Google, Bloomberg | Min-Heap or Chronological sweep |
| 14 | Interval List Intersections | 986 | Medium | 🔥🔥 High | Amazon, Google, Meta | Two-pointer interval intersection |

---

## Phase 3: Reachability & Jump Games

*Goal: Master max boundary tracking in single-pass linear time.*

| # | Problem | LC# / IB | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 15 | Jump Game I | 55 | Medium | 🔥🔥🔥 Very High | Amazon, Google, Meta | Track maxReach boundary |
| 16 | Jump Game II | 45 | Medium | 🔥🔥🔥 Very High | Amazon, Google, Meta | BFS / Level boundary jumping |
| 17 | Video Stitching | 1024 | Medium | 🔥🔥 High | Amazon, Google, Meta | Max reach per interval window |
| 18 | Minimum Number of Taps to Water Garden | 1326 | Hard | 🔥🔥 High | Amazon, Google, Meta | Convert to Jump Game II formulation |
| 19 | Gas Station | 134 / IB | Medium | 🔥🔥🔥 Very High | Amazon, Google, Meta | Single pass range elimination |

---

## Phase 4: PriorityQueue / Max-Min Heap Greedy

*Goal: Dynamic selection using heap data structures.*

| # | Problem | LC# / IB | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 20 | Task Scheduler | 621 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google | Frequency slots / Max-Heap eviction |
| 21 | Reorganize String | 767 | Medium | 🔥🔥 High | Amazon, Google, Meta | Max-Heap frequency arrangement |
| 22 | Rearrange String k Distance Apart | 358 | Hard | 🔥🔥 High | Amazon, Google, Meta | Max-Heap + Cooldown queue |
| 23 | Course Schedule III | 630 | Hard | 🔥🔥 High | Amazon, Google, Meta | Deadline sort + Max-Heap duration eviction |
| 24 | IPO (Initial Public Offering) | 502 | Hard | 🔥🔥 High | Amazon, Google, Meta | Dual Heap (Min Capital + Max Profit) |
| 25 | Maximum Performance of a Team | 1383 | Hard | 🔥🔥 High | Amazon, Google, Meta | Sort efficiency + Min-Heap speed |
| 26 | Minimum Cost to Hire K Workers | 857 | Hard | 🔥🔥 High | Amazon, Google, Meta | Ratio sort + Min-Heap quality |

---

## Phase 5: Two-Pass / Bidirectional Greedy

*Goal: Solve neighbor-dependent constraints using left and right sweeps.*

| # | Problem | LC# / IB | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 27 | Candy | 135 / IB | Hard | 🔥🔥🔥 Very High | Google, Amazon, Microsoft | Left pass + Right pass combining |
| 28 | Trapping Rain Water | 42 | Hard | 🔥🔥🔥 Very High | Google, Amazon, Meta, Goldman Sachs | Left max + Right max / Two pointers |
| 29 | Product of Array Except Self | 238 | Medium | 🔥🔥 High | Amazon, Google, Meta | Left prefix product * Right suffix product |
| 30 | Partition Labels | 763 | Medium | 🔥🔥 High | Amazon, Google | Last index map + boundary expansion |

---

## Phase 6: Monotonic Stack / Digit & String Greedy

*Goal: Lexicographical and numerical optimization using monotonic stack.*

| # | Problem | LC# / IB | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 31 | Remove K Digits | 402 | Medium | 🔥🔥 High | Google, Amazon, Microsoft | Monotonic increasing stack |
| 32 | Remove Duplicate Letters | 316 | Medium | 🔥🔥 High | Google, Amazon | Monotonic stack + frequency map |
| 33 | Smallest Subsequence of Distinct Characters | 1081 | Medium | 🔥🔥 High | Amazon, Google, Meta | Same pattern as #32 |
| 34 | Create Maximum Number | 321 | Hard | 🔥🔥 High | Amazon, Google, Meta | Monotonic stack + merge subproblems |
| 35 | Largest Number | 179 / IB | Medium | 🔥🔥 High | Amazon, Google, Meta | Custom string sorting `(b+a).compareTo(a+b)` |

---

## Phase 7: Math, Reverse Thinking & Ratio-Based Greedy

*Goal: Transform problem space by reversing operations or optimizing ratios.*

| # | Problem | LC# / IB | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 36 | Lemonade Change | 860 | Easy | 🔥🔥 High | Amazon, Google | Prioritize larger bills as change |
| 37 | Bag of Tokens | 948 | Medium | 🔥🔥 High | Amazon, Google, Meta | Buy low (power), sell high (score) |
| 38 | Broken Calculator | 991 | Medium | 🔥🔥 High | Amazon, Google, Meta | Reverse thinking: divide by 2 or add 1 |
| 39 | Minimum Replacement to Sort Array | 2366 | Hard | 🔥🔥 High | Amazon, Google, Meta | Right-to-left element splitting |
| 40 | Minimum Deletions to Make Character Frequencies Unique | 1647 | Medium | 🔥🔥 High | Amazon, Google, Meta | HashSet of seen frequencies |
| 41 | Wiggle Subsequence | 376 | Medium | 🔥🔥 High | Amazon, Google, Meta | Track alternating peaks and valleys |
| 42 | Maximum Swap | 670 | Medium | 🔥🔥 High | Amazon, Google, Meta | Last index map for max digit |

---

## Phase 8: Google-Level Multi-Pattern Hybrid Greedy

*Goal: Solve complex multi-constraint interview problems.*

| # | Problem | LC# / IB | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 43 | Patching Array | 330 | Hard | 🔥🔥 High | Amazon, Google, Meta | Reachability range expansion |
| 44 | Construct Target Array With Multiple Sums | 1354 | Hard | 🔥🔥 High | Amazon, Google, Meta | Reverse engineering Max-Heap |
| 45 | Stamping The Sequence | 936 | Hard | 🔥🔥 High | Amazon, Google, Meta | Reverse stamp matching with wildcards |
| 46 | Minimum Cost to Connect Sticks | 1168 | Medium | 🔥🔥 High | Amazon, Google, Meta | Huffman coding / Min-Heap pairing |
| 47 | Reduce Array Size to The Half | 1338 | Medium | 🔥🔥 High | Amazon, Google, Meta | Frequency bucket sort / heap greedy |
| 48 | Maximum Profit in Job Scheduling | 1235 | Hard | 🔥🔥 High | Amazon, Google, Meta | DP + Binary Search (Greedy choice subproblem) |
| 49 | Split Array into Consecutive Subsequences | 659 | Medium | 🔥🔥 High | Amazon, Google, Meta | Frequency map + Hypothesized chain map |
| 50 | Majority Element | 169 / IB | Easy | 🔥🔥🔥 Very High | Amazon, Google, Meta, Microsoft | Boyer-Moore Candidate Elimination |
