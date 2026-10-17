# Line Sweep Algorithm — Theory, Patterns & Interval Geometry

> **Study goal:** Master the Line Sweep (Sweep-Line) algorithmic paradigm for solving complex 1D and 2D interval intersection, geometric overlap, and concurrency scheduling problems.

---

## 1. Core Intuition

A **Line Sweep** algorithm imagines an imaginary line (vertical or horizontal) sweeping across a geometric plane or time timeline. 
Instead of testing all pairs of objects ($O(N^2)$), we:
1. Deconstruct intervals/shapes into discrete **Events** (e.g. `START`, `END`).
2. **Sort** all events by coordinate / timestamp ($O(N \log N)$).
3. Process events sequentially, maintaining an active state data structure (Counter, `TreeMap`, or Segment Tree).

```
Timeline:  0----1----2----3----4----5----6----7----8----9
Interval A:      [=========]              (start=1, end=4)
Interval B:           [=========]         (start=2, end=5)
Interval C:                   [=====]     (start=4, end=6)

Events:
  t=1: +1 active (Interval A begins) -> Active: 1
  t=2: +1 active (Interval B begins) -> Active: 2 (Overlap!)
  t=4: -1 active (Interval A ends)   -> Active: 1
  t=4: +1 active (Interval C begins) -> Active: 2
  t=5: -1 active (Interval B ends)   -> Active: 1
  t=6: -1 active (Interval C ends)   -> Active: 0
```

---

## 2. Common Patterns & Event Sorting Rules

### Pattern A: Maximum Concurrent Overlaps (Meeting Rooms II)
- Event: `(time, delta)` where start is `+1` and end is `-1`.
- **Tie-Breaking Rule**: When two events occur at the same timestamp, process `-1` (end) before `+1` (start) if intervals touching at a boundary do NOT overlap; process `+1` before `-1` if boundary touching counts as an overlap!

```java
class Event implements Comparable<Event> {
    int time;
    int type; // +1 for start, -1 for end

    public int compareTo(Event o) {
        if (this.time != o.time) return Integer.compare(this.time, o.time);
        return Integer.compare(this.type, o.type); // end before start if type is -1 vs +1
    }
}
```

### Pattern B: Merging Intervals
- Sort intervals by start time: `Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]))`.
- Maintain a running merged interval `[currStart, currEnd]`. If `next.start <= currEnd`, extend `currEnd = Math.max(currEnd, next.end)`. Otherwise, push `curr` and start a new merged interval.

### Pattern C: 2D Skyline Problem (Buildings & Heights)
- Break each building into two events: Left edge `(x1, -height)` and Right edge `(x2, +height)`.
- Use a `PriorityQueue` or `TreeMap` to track currently active building heights. When the maximum active height changes, record a key point.

---

## 3. Canonical FAANG Problem Set

| Problem | LeetCode # | Technique | Time Complexity |
|---|---|---|---|
| **Meeting Rooms II** | LC 253 | Event sorting / Min-Heap | $O(N \log N)$ |
| **Merge Intervals** | LC 56 | Sort by start time | $O(N \log N)$ |
| **Non-overlapping Intervals** | LC 435 | Greedy end-time sorting | $O(N \log N)$ |
| **The Skyline Problem** | LC 218 | Event sort + Max-Heap/TreeMap | $O(N \log N)$ |
| **Employee Free Time** | LC 759 | Interval merge + Gap extraction | $O(N \log N)$ |
| **Rectangle Area II** | LC 850 | 2D Line Sweep with 1D Interval Merge | $O(N^2 \log N)$ |
