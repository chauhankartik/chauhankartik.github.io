#!/usr/bin/env python3
import json

dsa_cards = [
    {
        "id": 101,
        "category": "dsa_patterns",
        "subtopic": "array",
        "categoryLabel": "DSA: Two Pointers",
        "difficulty": "Medium",
        "question": "Two Pointers Pattern: When do you use Opposite-Direction vs Fast & Slow (Same-Direction) pointers, and what is the optimal invariant?",
        "answer": "• Opposite-Direction (Left & Right inwards):\n  - Use case: Sorted arrays (Two Sum II, 3Sum, Container With Most Water, Valid Palindrome).\n  - Invariant: Eliminates an entire row/column of search space per step based on sorted monotonic property. Sum < target → `left++`; Sum > target → `right--`.\n\n• Fast & Slow Pointers (Same-Direction / Floyd's Cycle):\n  - Use case: Cycle detection in linked lists, duplicate number in array (Floyd's algorithm), removing duplicates in-place (in sorted array, fast explores, slow writes unique elements).\n  - Complexity: O(n) time, O(1) space.",
        "relatedDoc": "01_core_foundations/dsa/twopointers/README.md"
    },
    {
        "id": 102,
        "category": "dsa_patterns",
        "subtopic": "sliding_window",
        "categoryLabel": "DSA: Sliding Window",
        "difficulty": "Medium",
        "question": "Sliding Window Pattern: What is the universal template for Variable-Size Sliding Window (Dynamic Shrink)?",
        "answer": "Universal Template:\n```java\nint left = 0;\nfor (int right = 0; right < n; right++) {\n    // 1. Expand window: add nums[right] to state/frequency map\n    state.add(nums[right]);\n    \n    // 2. Shrink window while constraint is violated (or to optimize)\n    while (windowInvalid(state)) {\n        state.remove(nums[left]);\n        left++;\n    }\n    \n    // 3. Update answer with valid window: [left, right]\n    ans = Math.max(ans, right - left + 1);\n}\n```\n• Complexity: O(N) time (each element enters and leaves window at most once), O(K) space for frequency hash table.",
        "relatedDoc": "01_core_foundations/dsa/sliding_window/00_theory.md"
    },
    {
        "id": 103,
        "category": "dsa_patterns",
        "subtopic": "stack",
        "categoryLabel": "DSA: Monotonic Stack",
        "difficulty": "Hard",
        "question": "Monotonic Stack Pattern: How do you choose between Monotonically Increasing vs Decreasing stack, and what problems do they solve?",
        "answer": "• Monotonically Decreasing Stack (top is smallest):\n  - Resolves: Next Greater Element (NGE), Daily Temperatures, Online Stock Span.\n  - Logic: When `nums[i] > stack.peek()`, pop smaller elements because `nums[i]` is their next greater element.\n\n• Monotonically Increasing Stack (top is largest):\n  - Resolves: Next Smaller Element, Largest Rectangle in Histogram, Trapping Rain Water, Sum of Subarray Minimums.\n  - Invariant for Histogram: When popping height `h`, the current index `i` is the right boundary, and the new `stack.peek()` is the left boundary: `width = i - stack.peek() - 1`.\n  - Complexity: O(n) time since every element is pushed and popped at most once.",
        "relatedDoc": "01_core_foundations/dsa/stack/README.md"
    },
    {
        "id": 104,
        "category": "dsa_patterns",
        "subtopic": "queue",
        "categoryLabel": "DSA: Monotonic Deque",
        "difficulty": "Hard",
        "question": "Sliding Window Maximum Pattern: How does a Monotonic Deque maintain the window maximum in amortized O(1) per step?",
        "answer": "Maintain a double-ended queue (Deque) storing indices in strictly decreasing order of values (`nums[deque.peekFirst()]` is always window max):\n\n1. Evict Out of Window: If `deque.peekFirst() <= i - k`, call `deque.pollFirst()`.\n2. Maintain Monotonicity: While `!deque.isEmpty()` and `nums[deque.peekLast()] <= nums[i]`, call `deque.pollLast()` (smaller elements can never be the maximum since `nums[i]` is newer and larger).\n3. Push current index: `deque.offerLast(i)`.\n4. Output: For `i >= k - 1`, record `nums[deque.peekFirst()]`.\n\n• Complexity: O(n) total time, O(k) auxiliary space.",
        "relatedDoc": "01_core_foundations/dsa/sliding_window/00_theory.md"
    },
    {
        "id": 105,
        "category": "dsa_patterns",
        "subtopic": "array",
        "categoryLabel": "DSA: Prefix Sum & Hash",
        "difficulty": "Medium",
        "question": "Prefix Sum + HashMap Pattern: How do you solve 'Subarray Sum Equals K' and 'Continuous Subarray with Condition' in O(n)?",
        "answer": "Mathematical Invariant:\n`sum(i, j) = prefixSum[j] - prefixSum[i - 1] = k`\nRearranging: `prefixSum[i - 1] = prefixSum[j] - k`\n\nTemplate:\n```java\nMap<Integer, Integer> prefixFreq = new HashMap<>();\nprefixFreq.put(0, 1); // Base case for subarray starting at index 0\nint currSum = 0, count = 0;\nfor (int x : nums) {\n    currSum += x;\n    count += prefixFreq.getOrDefault(currSum - k, 0);\n    prefixFreq.put(currSum, prefixFreq.getOrDefault(currSum, 0) + 1);\n}\n```\n• Edge cases: Zeroes, negative numbers (sliding window fails with negatives, but prefix sum + hash map works seamlessly!).",
        "relatedDoc": "01_core_foundations/dsa/hashing/00_theory.md"
    },
    {
        "id": 106,
        "category": "dsa_patterns",
        "subtopic": "array",
        "categoryLabel": "DSA: Binary Search on Answer",
        "difficulty": "Hard",
        "question": "Binary Search on Answer Range Pattern: When does it apply, and what is the monotonic condition `feasible(mid)`?",
        "answer": "Applicability:\nWhen problem asks for 'Minimize the maximum' or 'Maximize the minimum' (e.g. Koko Eating Bananas, Split Array Largest Sum, Capacity To Ship Packages Within D Days, Aggressive Cows).\n\nMonotonic Invariant:\nIf condition `feasible(x)` is TRUE for capacity x, it is guaranteed TRUE for all `y > x` (Monotonic Predicate: F F F T T T).\n\nTemplate:\n```java\nint low = minPossible, high = maxPossible, ans = high;\nwhile (low <= high) {\n    int mid = low + (high - low) / 2;\n    if (feasible(nums, mid, limit)) {\n        ans = mid;      // Record possible answer\n        high = mid - 1; // Try smaller capacity\n    } else {\n        low = mid + 1;  // Must increase capacity\n    }\n}\n```\n• Complexity: O(N * log(Range)).",
        "relatedDoc": "01_core_foundations/dsa/array/README.md"
    },
    {
        "id": 107,
        "category": "dsa_patterns",
        "subtopic": "linkedlist",
        "categoryLabel": "DSA: Linked List Reversal",
        "difficulty": "Medium",
        "question": "Reverse Linked List in K-Groups: What is the 3-pointer in-place reversal invariant, and how do you handle boundary pointers?",
        "answer": "Standard 3-Pointer In-Place Reversal:\n```java\nListNode prev = null, curr = head;\nwhile (curr != null) {\n    ListNode next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n}\nreturn prev;\n```\n\nFor K-Group Reversal:\n1. Count k nodes ahead. If < k nodes remain, leave them as is.\n2. Keep `groupPrev` pointer immediately preceding the group to be reversed.\n3. Reverse k nodes, connecting `groupPrev.next` to the new group head, and the old group head (now tail) to the next group's starting node.\n4. Advance `groupPrev` to the reversed group's tail.",
        "relatedDoc": "01_core_foundations/dsa/linkedlist/README.md"
    },
    {
        "id": 108,
        "category": "dsa_patterns",
        "subtopic": "tree",
        "categoryLabel": "DSA: Trees & LCA",
        "difficulty": "Medium",
        "question": "Lowest Common Ancestor (LCA): What is the post-order recursive divide-and-conquer invariant for Binary Tree vs BST?",
        "answer": "• General Binary Tree LCA (O(n) time, O(h) space):\n```java\npublic TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n    if (root == null || root == p || root == q) return root;\n    TreeNode left = lowestCommonAncestor(root.left, p, q);\n    TreeNode right = lowestCommonAncestor(root.right, p, q);\n    if (left != null && right != null) return root; // p and q in opposite subtrees\n    return left != null ? left : right;\n}\n```\n\n• Binary Search Tree (BST) LCA (O(h) time, O(1) space):\n  - If both `p.val` and `q.val` < `root.val` → search `root.left`.\n  - If both `p.val` and `q.val` > `root.val` → search `root.right`.\n  - Else, current `root` is the split point (LCA)!",
        "relatedDoc": "01_core_foundations/dsa/tree/README.md"
    },
    {
        "id": 109,
        "category": "dsa_patterns",
        "subtopic": "trie",
        "categoryLabel": "DSA: Trie & Bitwise XOR",
        "difficulty": "Hard",
        "question": "Maximum XOR of Two Numbers in an Array: How does a Bitwise Trie achieve O(32 * N) optimal solution?",
        "answer": "Strategy:\nRepresent numbers as 31-bit binary strings (from MSB bit 30 down to LSB bit 0).\n\n1. Insert each number into a binary Trie where each node has `child[0]` and `child[1]`.\n2. Query: For number X, at each bit `b`, greedily seek the complementary bit `1 - b` in the Trie:\n   - If `child[1 - b]` exists, choose it (yielding a 1 in this bit position: `maxVal |= (1 << i)`).\n   - Else, fall back to `child[b]`.\n\nWhy MSB first? Bitwise greedy property: A 1 at bit `k` outweighs all possible 1s from bit `0` to `k-1` combined ($2^k > \sum_{i=0}^{k-1} 2^i$).",
        "relatedDoc": "01_core_foundations/dsa/trie/00_theory.md"
    },
    {
        "id": 110,
        "category": "dsa_patterns",
        "subtopic": "backtracking",
        "categoryLabel": "DSA: Backtracking & Pruning",
        "difficulty": "Hard",
        "question": "Backtracking Pattern: How do you prune duplicate subsets/permutations without a HashSet, and what is the Choose-Explore-Unchoose template?",
        "answer": "Template:\n```java\nvoid backtrack(int start, List<Integer> current, int[] nums) {\n    result.add(new ArrayList<>(current));\n    for (int i = start; i < nums.length; i++) {\n        // Prune duplicates (requires sorted nums!)\n        if (i > start && nums[i] == nums[i - 1]) continue;\n        \n        current.add(nums[i]);            // 1. Choose\n        backtrack(i + 1, current, nums); // 2. Explore\n        current.remove(current.size() - 1); // 3. Unchoose\n    }\n}\n```\n• Why `i > start`? It permits using identical duplicate values at different depth levels of the decision tree, but prevents starting sibling branches with the same value at the identical decision depth.",
        "relatedDoc": "01_core_foundations/dsa/backtracking/00_theory.md"
    },
    {
        "id": 111,
        "category": "dsa_patterns",
        "subtopic": "greedy",
        "categoryLabel": "DSA: Interval Scheduling Greedy",
        "difficulty": "Medium",
        "question": "Interval Scheduling Greedy Pattern: Sort by Start Time vs End Time? What are the formal proof mechanisms?",
        "answer": "• Maximum Non-Overlapping Intervals (Interval Scheduling):\n  - Rule: Sort intervals by **End Time** ascending (`intervals[i][1]`).\n  - Greedily pick the interval that finishes earliest (leaves maximum possible time for subsequent intervals).\n  - Proof: Exchange argument ('Stays Ahead') — any alternative choice finishes at the same time or later, never leaving more residual time.\n\n• Minimum Meeting Rooms (Simultaneous Overlaps):\n  - Rule: Sort by **Start Time** ascending, use a Min-Heap tracking end times of active rooms.\n  - If `minHeap.peek() <= curr.start`, reuse room (`minHeap.poll()`); else, allocate new room.\n  - Push `curr.end` to heap.",
        "relatedDoc": "01_core_foundations/dsa/greedy/00_theory.md"
    },
    {
        "id": 112,
        "category": "dsa_patterns",
        "subtopic": "dynamicprogramming",
        "categoryLabel": "DSA: 0/1 Knapsack vs Unbounded",
        "difficulty": "Medium",
        "question": "Dynamic Programming: How do you optimize 0/1 Knapsack to 1D space, and why must the inner loop run in Reverse?",
        "answer": "0/1 Knapsack (each item used at most once):\n```java\nint[] dp = new int[capacity + 1];\nfor (int i = 0; i < n; i++) {\n    // Inner loop MUST run BACKWARDS from capacity down to weight[i]\n    for (int w = capacity; w >= weights[i]; w--) {\n        dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);\n    }\n}\n```\n• Why Reverse? If run forwards, `dp[w - weights[i]]` would have already been updated in the *current* iteration, accidentally allowing the item to be included multiple times (which is Unbounded Knapsack!). Backward traversal ensures `dp[w - weights[i]]` comes from previous step `i-1`.",
        "relatedDoc": "01_core_foundations/dsa/dynamicprogramming/README.md"
    },
    {
        "id": 113,
        "category": "dsa_patterns",
        "subtopic": "dynamicprogramming",
        "categoryLabel": "DSA: Longest Increasing Subsequence",
        "difficulty": "Hard",
        "question": "Longest Increasing Subsequence (LIS): How does Patience Sorting achieve O(N log N) using Binary Search?",
        "answer": "Patience Sorting Algorithm:\nMaintain an array `tails` where `tails[i]` stores the smallest tail element of all increasing subsequences of length `i + 1`.\n\nFor each number `x` in `nums`:\n1. Use Binary Search (`Arrays.binarySearch` or custom) to find the first element in `tails` that is `>= x`.\n2. If `x` is larger than all elements in `tails`, append `x` to `tails` (extends LIS length by 1).\n3. Else, update `tails[idx] = x` (lowering the tail value, making it easier for future elements to extend this subsequence).\n\n• Output: Length of `tails` is the length of LIS. Time: O(N log N), Space: O(N).",
        "relatedDoc": "01_core_foundations/dsa/dynamicprogramming/README.md"
    },
    {
        "id": 114,
        "category": "dsa_patterns",
        "subtopic": "graph",
        "categoryLabel": "DSA: Topological Sort (Kahn's)",
        "difficulty": "Medium",
        "question": "Topological Sort: Explain Kahn's In-Degree Algorithm and how it detects Directed Cycles.",
        "answer": "Kahn's Algorithm (BFS based):\n1. Compute `inDegree[u]` for all vertices (count of incoming directed edges).\n2. Enqueue all vertices with `inDegree[u] == 0` into a FIFO Queue.\n3. While queue is not empty:\n   - Pop vertex `u`, append `u` to topological order.\n   - For each outgoing neighbor `v` of `u`:\n     - Decrement `inDegree[v]--`.\n     - If `inDegree[v] == 0`, offer `v` to queue.\n4. Cycle Detection: If `processedCount != V` (not all vertices visited), the graph contains a directed cycle (deadlock / circular dependency).\n\n• Complexity: O(V + E) time, O(V) space.",
        "relatedDoc": "01_core_foundations/dsa/Graph-Algorithms-Masterclass/README.md"
    },
    {
        "id": 115,
        "category": "dsa_patterns",
        "subtopic": "graph",
        "categoryLabel": "DSA: Dijkstra's Algorithm",
        "difficulty": "Medium",
        "question": "Dijkstra's Shortest Path: Why does it fail with negative edge weights, and what is the optimal Min-Heap complexity?",
        "answer": "Dijkstra's Invariant:\nGreedily marks the closest unvisited node as finalized, assuming that any alternate path passing through other unvisited nodes will have a strictly greater distance.\n\nWhy it fails with negative edges:\nA subsequent negative edge could make a previously finalized node's path distance shorter, violating the greedy non-decreasing path length assumption. Use Bellman-Ford O(V * E) for negative weights.\n\nComplexity with Binary Min-Heap:\n• Time: O((V + E) log V). Each vertex extracted from heap once (V log V); each edge causes at most one priority decrease / re-insertion (E log V).\n• Space: O(V + E) for adjacency list and dist array.",
        "relatedDoc": "01_core_foundations/dsa/Graph-Algorithms-Masterclass/README.md"
    },
    {
        "id": 116,
        "category": "dsa_patterns",
        "subtopic": "graph",
        "categoryLabel": "DSA: Disjoint Set Union (DSU)",
        "difficulty": "Medium",
        "question": "Disjoint Set Union (Union-Find): How do Path Compression and Union by Rank achieve near O(1) Ackermann complexity?",
        "answer": "Two Optimizations:\n1. Path Compression in `find(x)`:\n   Points every visited node directly to the set representative root:\n   `parent[x] = find(parent[x]); return parent[x];`\n   Flattens tree depth to 1 on traversal.\n\n2. Union by Rank/Size in `union(x, y)`:\n   Always attaches the shorter tree under the root of the taller tree to minimize tree height growth.\n\nCombined Complexity:\n• Amortized time per operation is O(α(N)) where α is the Inverse Ackermann function. For all practical values of N ($N < 10^{600}$), $\alpha(N) \le 4$, making operations effectively O(1).",
        "relatedDoc": "01_core_foundations/dsa/graph/README.md"
    },
    {
        "id": 117,
        "category": "dsa_patterns",
        "subtopic": "linesweep",
        "categoryLabel": "DSA: Line Sweep Algorithm",
        "difficulty": "Hard",
        "question": "Line Sweep Pattern: How do you decompose 2D geometry and interval intersection problems into 1D sorted events?",
        "answer": "Core Strategy:\nImagine a vertical line sweeping from left to right across the x-axis, stopping at discrete 'event' points (start points, end points).\n\nEvent Modeling:\n• Start of interval: Event `(x_start, +1, payload)`\n• End of interval: Event `(x_end, -1, payload)`\n\nEvent Sorting Tie-Breaker Rules:\n• If x coordinates are equal, order depends on problem semantics:\n  - For Meeting Rooms II (touching endpoints do not overlap): process `END (-1)` events BEFORE `START (+1)` events.\n  - For Skyline / Rectangle Area: maintain an active data structure (TreeMap / Multiset) of currently intersecting intervals.\n\n• Complexity: O(N log N) for sorting events + O(N log K) for active set updates.",
        "relatedDoc": "01_core_foundations/dsa/linesweep/README.md"
    },
    {
        "id": 118,
        "category": "dsa_patterns",
        "subtopic": "dynamicprogramming",
        "categoryLabel": "DSA: Interval DP",
        "difficulty": "Hard",
        "question": "Interval DP Pattern: What is the loop order for subproblem formulation (e.g. Burst Balloons, Matrix Chain Multiplication)?",
        "answer": "Interval DP Invariant:\nTo compute `dp[i][j]` (representing the interval from index `i` to `j`), all smaller sub-intervals within `[i, j]` must already be solved!\n\nStandard Loop Order (by Interval Length):\n```java\nfor (int len = 1; len <= n; len++) {       // 1. Outer loop: interval length\n    for (int i = 0; i <= n - len; i++) {   // 2. Left boundary\n        int j = i + len - 1;               // 3. Right boundary\n        for (int k = i; k < j; k++) {      // 4. Split point\n            dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k + 1][j] + cost(i, k, j));\n        }\n    }\n}\n```\n• Complexity: O(N^3) time, O(N^2) space.",
        "relatedDoc": "01_core_foundations/dsa/dynamicprogramming/README.md"
    }
]

# Read existing cards and merge
try:
    with open('assets/data/flashcards.json', 'r') as f:
        existing = json.load(f)
except Exception:
    existing = []

# Merge without duplicating IDs
existing_ids = set(c['id'] for c in existing)
merged = list(existing)

for card in dsa_cards:
    if card['id'] not in existing_ids:
        merged.append(card)

with open('assets/data/flashcards.json', 'w') as f:
    json.dump(merged, f, indent=2, ensure_ascii=False)

print(f"✅ Successfully wrote {len(merged)} total flashcards ({len(dsa_cards)} DSA pattern cards added)!")
