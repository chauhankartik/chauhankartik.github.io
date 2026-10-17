# Line Sweep — Quick Cheatsheet & Templates

## 1. Meeting Rooms II (Event-Based Line Sweep)

```java
public int minMeetingRooms(int[][] intervals) {
    if (intervals == null || intervals.length == 0) return 0;
    
    // Deconstruct intervals into start (+1) and end (-1) events
    List<int[]> events = new ArrayList<>();
    for (int[] inv : intervals) {
        events.add(new int[]{inv[0], 1});   // start
        events.add(new int[]{inv[1], -1});  // end
    }
    
    // Sort: if times are equal, process end (-1) before start (+1)
    events.sort((a, b) -> a[0] != b[0] ? Integer.compare(a[0], b[0]) : Integer.compare(a[1], b[1]));
    
    int maxRooms = 0, currentRooms = 0;
    for (int[] e : events) {
        currentRooms += e[1];
        maxRooms = Math.max(maxRooms, currentRooms);
    }
    return maxRooms;
}
```

## 2. Merge Intervals

```java
public int[][] merge(int[][] intervals) {
    if (intervals.length <= 1) return intervals;
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    
    List<int[]> result = new ArrayList<>();
    int[] current = intervals[0];
    result.add(current);
    
    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] <= current[1]) {
            current[1] = Math.max(current[1], intervals[i][1]);
        } else {
            current = intervals[i];
            result.add(current);
        }
    }
    return result.toArray(new int[result.size()][]);
}
```
