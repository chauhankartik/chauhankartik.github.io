# Linear Data Structures & Stream Processing Masterclass

A production-grade, pattern-oriented curriculum covering foundational and advanced linear data structures — Stacks, Monotonic Stacks, Queues, Monotonic Deques, Heaps / Priority Queues, and Stateful Stream Buffers.

---

## 🗺️ Masterclass Pattern Architecture

| Pattern | Focus Area | Canonical Algorithms & Problems | Key Complexities |
|---|---|---|---|
| **[Pattern 1](./Pattern-1-Core-Stack-Mechanics-and-Parsing/)** | Core Stack Mechanics & Grammar Parsing | Parenthesis validation, State evaluation, Min Stack, Basic Calculator I, II & III | Time: $O(N)$<br>Space: $O(N)$ |
| **[Pattern 2](./Pattern-2-Monotonic-Stacks-Linear-Lookbehinds/)** | Monotonic Stacks (Linear Lookbehinds) | Next Greater Element, Daily Temperatures, Largest Rectangle in Histogram, Trapping Rain Water | Time: $O(N)$ (Amortized)<br>Space: $O(N)$ |
| **[Pattern 3](./Pattern-3-Core-Queue-Mechanics-and-Buffering/)** | Queue Mechanics & Ring Buffers | Circular Queue Design, Queue using Stacks, Bounded Ring Buffers, Maximal Network Rank | Time: $O(1)$ push/pop<br>Space: $O(K)$ |
| **[Pattern 4](./Pattern-4-Monotonic-Deques-and-Sliding-Windows/)** | Monotonic Deques & Sliding Windows | Sliding Window Maximum (LeetCode 239), Longest Continuous Subarray with Absolute Diff, Constrained Subsequence Sum | Time: $O(N)$ amortized<br>Space: $O(K)$ |
| **[Pattern 5](./Pattern-5-Priority-Queues-and-Heap-Mechanics/)** | Priority Queues & Heap Mechanics | Binary Heaps, Top K Frequent Elements, Kth Largest in Array, Find Median from Data Stream (Two-Heap Pattern) | Time: $O(\log K)$ insert<br>Space: $O(K)$ |
| **[Pattern 6](./Pattern-6-Two-Pointer-and-Stack-Hybrids/)** | Two-Pointer & Stack Hybrids | Backspace String Compare, Remove Duplicate Letters (Lexicographically Smallest), Trapping Rain Water Dual-Pointer | Time: $O(N)$<br>Space: $O(1)$ to $O(N)$ |
| **[Pattern 7](./Pattern-7-Stateful-Stream-Processing/)** | Stateful Stream Buffers & Chunks | Moving Average from Data Stream, Online Stock Span, Max Chunks To Make Sorted II | Time: $O(1)$ amortized<br>Space: $O(N)$ |

---

## 🎯 Quick Selection Guide: Which Linear Structure When?

```
Do you need LIFO (Last-In First-Out) or recursive state tracking?
 └── YES ➔ Stack

Do you need the nearest greater/smaller element to the left or right in O(N)?
 └── YES ➔ Monotonic Stack (increasing or decreasing order)

Do you need FIFO (First-In First-Out) or task buffering?
 └── YES ➔ Queue / ArrayDeque

Do you need sliding window max/min within a moving interval of size K in O(N)?
 └── YES ➔ Monotonic Deque (Double-ended queue)

Do you need constant-time retrieval of the minimum or maximum element with dynamic updates?
 └── YES ➔ PriorityQueue / Min-Max Binary Heap [O(log N)]

Do you need running median over a continuous stream of numbers?
 └── YES ➔ Two Heaps (Max-Heap for lower half, Min-Heap for upper half)
```
