# Linked List — Top 50 Problems (Intuition-Building Order)
> **How to use this list:** Work through each section in order.
> Each phase builds on the previous one. Master the pointer invariants before moving on.
> Use the **Interview Frequency** column to prioritize must-solve problems for upcoming FAANG/Tier-1 interviews.

---

## 📊 Interview Frequency Legend

| Tier | Badge | Interview Frequency | Description | Target Companies |
|---|---|---|---|---|
| **Tier 1** | 🔥🔥🔥 **Very High** | Appears in >70% of candidate question pools | Absolute must-solve before any interview | Meta, Google, Amazon, Microsoft, Apple, Bloomberg |
| **Tier 2** | 🔥🔥 **High** | Core interview standard (35%–70%) | Regular interview staple; tests pattern variation fluency | Amazon, Google, Meta, Uber, ByteDance |
| **Tier 3** | 🔥 **Medium** | Follow-up / classic variant (<35%) | Tests edge cases, extensions, and deeper mathematical insight | Top tech phone screens & online assessments |

---

## 🏆 Top 15 Must-Solve Linked List Problems (Highest Frequency)

If you have limited time before an interview, solve these first:

| Rank | Problem | LC# | Difficulty | Frequency | Top Companies | Core Pattern / Concept |
|---|---|---|---|---|---|---|
| 1 | **Reverse Linked List** | 206 | Easy | 🔥🔥🔥 Very High | Meta, Amazon, Google, Microsoft, Apple | 3-pointer iterative inversion (prev, curr, next) |
| 2 | **Merge Two Sorted Lists** | 21 | Easy | 🔥🔥🔥 Very High | Meta, Amazon, Microsoft, Apple | Dummy head + 2-pointer zipper merge |
| 3 | **Linked List Cycle** | 141 | Easy | 🔥🔥🔥 Very High | Amazon, Microsoft, Meta | Floyd's Tortoise and Hare |
| 4 | **Add Two Numbers** | 2 | Medium | 🔥🔥🔥 Very High | Amazon, Meta, Google, Microsoft, Apple | Column addition with carry propagation |
| 5 | **LRU Cache** | 146 | Medium | 🔥🔥🔥 Very High | Meta, Google, Amazon, Apple, Bloomberg | Doubly Linked List + HashMap |
| 6 | **Remove Nth Node From End of List** | 19 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Apple | Gap of n+1 between fast and slow |
| 7 | **Copy List with Random Pointer** | 138 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google, Microsoft | Interweaving nodes vs HashMap clone |
| 8 | **Merge K Sorted Lists** | 23 | Hard | 🔥🔥🔥 Very High | Meta, Amazon, Google, Microsoft, Uber | Min-Heap priority queue or Divide & Conquer |
| 9 | **Reverse Nodes in k-Group** | 25 | Hard | 🔥🔥🔥 Very High | Google, Meta, Amazon, Microsoft | Count k nodes, reverse subsegment, link recursively |
| 10 | **Reorder List** | 143 | Medium | 🔥🔥🔥 Very High | Meta, Amazon | Find middle + reverse 2nd half + merge |
| 11 | **Reverse Linked List II** | 92 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Microsoft | Sublist head/tail reconnection |
| 12 | **Middle of the Linked List** | 876 | Easy | 🔥🔥 High | Amazon, Google | Fast (2x) and slow (1x) pointers |
| 13 | **Linked List Cycle II (Find Start)** | 142 | Medium | 🔥🔥 High | Amazon, Microsoft | Floyd's phase 2: reset slow to head |
| 14 | **Sort List** | 148 | Medium | 🔥🔥 High | Google, Amazon | Top-down or bottom-up merge sort on LL |
| 15 | **LFU Cache** | 460 | Hard | 🔥🔥🔥 Very High | Google, Amazon, Meta | Doubly LL per frequency + min-freq pointer |

---

## Phase 1: Pointer Traversal & In-Place Mutation

*Goal: Master single-pass pointer navigation, dummy heads, and basic splicing.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 1 | Reverse Linked List | 206 | Easy | 🔥🔥🔥 Very High | Meta, Amazon, Google, Microsoft, Apple | 3-pointer iterative inversion |
| 2 | Middle of the Linked List | 876 | Easy | 🔥🔥 High | Amazon, Google | Fast (2x) and slow (1x) pointers |
| 3 | Delete Node in a Linked List | 237 | Easy | 🔥 Medium | Apple, Amazon | Overwrite value with next.val, skip next |
| 4 | Remove Linked List Elements | 203 | Easy | 🔥🔥 High | Amazon, Microsoft | Dummy head, skip target values |
| 5 | Odd Even Linked List | 328 | Medium | 🔥🔥 High | Amazon, Google | Split into odd/even chains, stitch together |
| 6 | Swapping Nodes in a Linked List | 1721 | Medium | 🔥🔥 High | Amazon, Microsoft | Find k-th from start and k-th from end |

---

## Phase 2: Fast & Slow Pointers (Floyd's Cycle Finding)

*Goal: Master two-pointer collision math and midpoint splits.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 7 | Linked List Cycle | 141 | Easy | 🔥🔥🔥 Very High | Amazon, Microsoft, Meta | fast/slow meet iff cycle exists |
| 8 | Linked List Cycle II | 142 | Medium | 🔥🔥 High | Amazon, Microsoft | Floyd phase 2: reset slow to head, 1 step each |
| 9 | Palindrome Linked List | 234 | Easy | 🔥🔥 High | Meta, Amazon | Find middle + reverse right half + compare |
| 10 | Intersection of Two Linked Lists | 160 | Easy | 🔥🔥 High | Amazon, Meta, Microsoft | Switch heads at end: a->b and b->a equalize length |
| 11 | Happy Number | 202 | Easy | 🔥🔥 High | Amazon, Apple, Uber | Cycle detection on sum of squared digits |
| 12 | Find the Duplicate Number | 287 | Medium | 🔥🔥 High | Google, Amazon | Array values as next pointers → cycle detection |

---

## Phase 3: Sublist Reversal & K-Group Manipulation

*Goal: Master boundary tracking and in-place pointer rewiring without losing nodes.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 13 | Reverse Linked List II | 92 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Microsoft | Sublist reverse between left and right |
| 14 | Swap Nodes in Pairs | 24 | Medium | 🔥🔥 High | Amazon, Microsoft | Pairwise reversal with dummy head |
| 15 | Reverse Nodes in k-Group | 25 | Hard | 🔥🔥🔥 Very High | Google, Meta, Amazon, Microsoft | Sublist check, k-group reversal, recursive stitch |
| 16 | Rotate List | 61 | Medium | 🔥🔥 High | Amazon, Bloomberg | Connect tail to head (ring), break at len - (k % len) |
| 17 | Reverse Nodes in Even Length Groups | 2074 | Medium | 🔥 Medium | Google | Track group size, reverse only if group length is even |

---

## Phase 4: Merging, Sorting & Multi-List Arithmetic

*Goal: Combine multiple sorted lists and perform list-based big integer math.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 18 | Merge Two Sorted Lists | 21 | Easy | 🔥🔥🔥 Very High | Meta, Amazon, Microsoft, Apple | Dummy head + 2-pointer zipper merge |
| 19 | Merge K Sorted Lists | 23 | Hard | 🔥🔥🔥 Very High | Meta, Amazon, Google, Microsoft, Uber | Min-Heap priority queue or D&C pairwise merge |
| 20 | Add Two Numbers | 2 | Medium | 🔥🔥🔥 Very High | Amazon, Meta, Google, Microsoft, Apple | Forward addition with carry propagation |
| 21 | Add Two Numbers II | 445 | Medium | 🔥🔥 High | Amazon, Microsoft | Digits most-significant first: use two stacks |
| 22 | Partition List | 86 | Medium | 🔥🔥 High | Amazon, Microsoft | Two dummy heads (< x and >= x), join at end |
| 23 | Sort List | 148 | Medium | 🔥🔥 High | Google, Amazon | Merge sort on linked list: split by mid + merge |
| 24 | Insertion Sort List | 147 | Medium | 🔥 Medium | Amazon | Maintain sorted prefix, insert curr at correct pos |

---

## Phase 5: Complex Pointers & Deep Copying

*Goal: Handle auxiliary links (random, child, multilevel) with O(1) space.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 25 | Copy List with Random Pointer | 138 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Google, Microsoft | In-place node interweaving vs HashMap clone |
| 26 | Flatten a Multilevel Doubly Linked List | 430 | Medium | 🔥🔥 High | Bloomberg, Amazon | DFS/Stack: splice child list into next |
| 27 | Split Linked List in Parts | 725 | Medium | 🔥 Medium | Amazon, Google | Division + remainder for extra element distribution |
| 28 | Reorder List | 143 | Medium | 🔥🔥🔥 Very High | Meta, Amazon | Find middle, reverse second half, interleave |
| 29 | Remove Duplicates from Sorted List | 83 | Easy | 🔥🔥 High | Amazon, Microsoft | Skip adjacent equal values |
| 30 | Remove Duplicates from Sorted List II | 82 | Medium | 🔥🔥 High | Amazon, Meta | Remove ALL duplicates using dummy + lookahead |
| 31 | Remove Nth Node From End of List | 19 | Medium | 🔥🔥🔥 Very High | Meta, Amazon, Apple | Gap of n+1 between fast and slow pointers |

---

## Phase 6: Doubly Linked Lists & Deque Systems

*Goal: Implement bidirectional navigation and circular structures.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 32 | Design Linked List | 707 | Medium | 🔥🔥 High | Amazon, Apple | Singly or doubly linked list with head and tail |
| 33 | Flatten Binary Tree to Linked List | 114 | Medium | 🔥🔥 High | Meta, Amazon, Microsoft | Preorder threading via right pointer mutation |
| 34 | Convert BST to Sorted DLL | 426 | Medium | 🔥🔥🔥 Very High | Meta, Microsoft, Amazon | Inorder traversal + circular link prev and curr |
| 35 | Insert into a Sorted Circular Linked List | 708 | Medium | 🔥🔥 High | Meta, Google | Find insertion interval or rotation pivot |
| 36 | Design Front Middle Back Queue | 1670 | Medium | 🔥 Medium | Amazon | Two deques balanced around midpoint |

---

## Phase 7: LRU / LFU Cache & System Design

*Goal: Master O(1) eviction architectures using Hash + Doubly Linked Lists.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 37 | LRU Cache | 146 | Medium | 🔥🔥🔥 Very High | Meta, Google, Amazon, Apple, Bloomberg | Doubly LL + HashMap for O(1) get/put |
| 38 | LFU Cache | 460 | Hard | 🔥🔥🔥 Very High | Google, Amazon, Meta | Doubly LL per frequency bucket + min-frequency tracking |
| 39 | Design Browser History | 1472 | Medium | 🔥🔥🔥 Very High | Bloomberg, Amazon, Google | Doubly LL or 2 stacks for back/forward navigation |
| 40 | All O`one Data Structure | 432 | Hard | 🔥🔥 High | Google, Meta | Doubly LL of frequency buckets + HashSet of keys |
| 41 | Flatten 2D Vector | 251 | Medium | 🔥 Medium | Airbnb, Google | Two pointers / iterators over nested list |

---

## Phase 8: Advanced & Google-Level

*Goal: Solve non-trivial combinations of linked lists with monotonic stacks, recursion, and intervals.*

| # | Problem | LC# | Difficulty | Frequency | Top Companies | Key Concept |
|---|---|---|---|---|---|---|
| 42 | Maximum Twin Sum of a Linked List | 2130 | Medium | 🔥🔥 High | Amazon, Meta | Reverse second half, pairwise sum check |
| 43 | Merge Nodes in Between Zeros | 2181 | Medium | 🔥 Medium | Amazon | Accumulate values until 0, write in-place |
| 44 | Double a Number Represented as a Linked List | 2816 | Medium | 🔥 Medium | Google | Carry lookahead: if curr.next.val >= 5, add 1 |
| 45 | Next Greater Node in Linked List | 1019 | Medium | 🔥 Medium | Amazon | Convert to array or monotonic stack with indices |
| 46 | Reverse Substrings Between Each Pair of Parentheses | 1190 | Medium | 🔥🔥 High | Google, Amazon | Wormhole pointer jumps (doubly-linked simulation) |
| 47 | Plus One Linked List | 369 | Medium | 🔥 Medium | Google, Amazon | Find rightmost non-9 node or reverse list |
| 48 | Remove Zero Sum Consecutive Nodes from Linked List | 1171 | Medium | 🔥🔥 High | Google, Amazon | Prefix sum + HashMap of last node with same sum |
| 49 | Split BST | 776 | Medium | 🔥 Medium | Google | Recursive sublist partitioning on BST invariants |
| 50 | Design Skiplist | 1206 | Hard | 🔥🔥 High | Google, Amazon | Probabilistic multi-level forward linked lists |

---

## Study Roadmap

```
Tier 1 Sprint (Emergency FAANG Prep):
  Focus exclusively on 🔥🔥🔥 (Very High) problems in the Top 15 list above.

Complete Roadmap (Intuition-Building):
  Week 1 (Days 1-2):  Phase 1-2 — Traversals & Floyd's Cycle (#1-#12)
  Week 1 (Days 3-4):  Phase 3 — Sublist Reversal & K-Group (#13-#17)
  Week 1 (Day 5):     Phase 4 — Merging & Arithmetic (#18-#24)
  Week 2 (Days 1-2):  Phase 5 — Deep Copying & In-Place Splicing (#25-#31)
  Week 2 (Days 3-4):  Phase 6 — Doubly Linked Lists & Deques (#32-#36)
  Week 2 (Day 5):     Phase 7 — LRU / LFU Cache Architecture (#37-#41)
  Week 3 (Days 1-3):  Phase 8 — Advanced / Google-Level (#42-#50)
```
