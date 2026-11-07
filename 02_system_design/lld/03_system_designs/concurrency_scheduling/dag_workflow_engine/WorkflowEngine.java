package concurrency_scheduling.dag_workflow_engine;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

/**
 * ============================================================================
 * Production-Grade Dynamic DAG Workflow Execution Engine
 * Staff / Principal Systems Architecture & Low-Level Design
 * ============================================================================
 */
public class WorkflowEngine {

    // =========================================================================
    // 1. Core Data Models & State Enums
    // =========================================================================

    public enum TaskStatus {
        PENDING,
        READY,
        RUNNING,
        RETRYING,
        SUCCESS,
        FAILED,
        SKIPPED,
        CANCELLED;

        public boolean isTerminal() {
            return this == SUCCESS || this == FAILED || this == SKIPPED || this == CANCELLED;
        }
    }

    public enum WorkflowStatus {
        PENDING,
        RUNNING,
        SUCCESS,
        FAILED,
        CANCELLED
    }

    @FunctionalInterface
    public interface TaskAction {
        Object execute(TaskContext context) throws Exception;
    }

    public static class TaskContext {
        private final String workflowId;
        private final String taskId;
        private final int attempt;
        private final Map<String, Object> upstreamOutputs;

        public TaskContext(String workflowId, String taskId, int attempt, Map<String, Object> upstreamOutputs) {
            this.workflowId = workflowId;
            this.taskId = taskId;
            this.attempt = attempt;
            this.upstreamOutputs = Collections.unmodifiableMap(new HashMap<>(upstreamOutputs));
        }

        public String getWorkflowId() { return workflowId; }
        public String getTaskId() { return taskId; }
        public int getAttempt() { return attempt; }
        public Object getUpstreamOutput(String depTaskId) { return upstreamOutputs.get(depTaskId); }
        public Map<String, Object> getAllUpstreamOutputs() { return upstreamOutputs; }
    }

    public static class Task {
        private final String id;
        private final String name;
        private final Set<String> dependencies;
        private final TaskAction action;
        private final int maxRetries;
        private final long initialBackoffMs;
        private final double backoffMultiplier;
        private final long maxBackoffMs;

        private Task(Builder builder) {
            this.id = Objects.requireNonNull(builder.id, "Task id cannot be null");
            this.name = builder.name != null ? builder.name : builder.id;
            this.dependencies = Collections.unmodifiableSet(new HashSet<>(builder.dependencies));
            this.action = Objects.requireNonNull(builder.action, "Task action cannot be null");
            this.maxRetries = builder.maxRetries;
            this.initialBackoffMs = builder.initialBackoffMs;
            this.backoffMultiplier = builder.backoffMultiplier;
            this.maxBackoffMs = builder.maxBackoffMs;
        }

        public String getId() { return id; }
        public String getName() { return name; }
        public Set<String> getDependencies() { return dependencies; }
        public TaskAction getAction() { return action; }
        public int getMaxRetries() { return maxRetries; }
        public long getInitialBackoffMs() { return initialBackoffMs; }
        public double getBackoffMultiplier() { return backoffMultiplier; }
        public long getMaxBackoffMs() { return maxBackoffMs; }

        public static class Builder {
            private final String id;
            private String name;
            private final Set<String> dependencies = new HashSet<>();
            private TaskAction action;
            private int maxRetries = 0;
            private long initialBackoffMs = 100;
            private double backoffMultiplier = 2.0;
            private long maxBackoffMs = 2000;

            public Builder(String id) {
                this.id = id;
            }

            public Builder name(String name) {
                this.name = name;
                return this;
            }

            public Builder dependsOn(String... depTaskIds) {
                this.dependencies.addAll(Arrays.asList(depTaskIds));
                return this;
            }

            public Builder action(TaskAction action) {
                this.action = action;
                return this;
            }

            public Builder retries(int maxRetries, long initialBackoffMs, double multiplier, long maxBackoffMs) {
                this.maxRetries = maxRetries;
                this.initialBackoffMs = initialBackoffMs;
                this.backoffMultiplier = multiplier;
                this.maxBackoffMs = maxBackoffMs;
                return this;
            }

            public Task build() {
                return new Task(this);
            }
        }
    }

    public static class Workflow {
        private final String id;
        private final String name;
        private final Map<String, Task> tasks;

        private Workflow(Builder builder) {
            this.id = Objects.requireNonNull(builder.id, "Workflow id cannot be null");
            this.name = builder.name != null ? builder.name : builder.id;
            this.tasks = Collections.unmodifiableMap(new LinkedHashMap<>(builder.tasks));
        }

        public String getId() { return id; }
        public String getName() { return name; }
        public Map<String, Task> getTasks() { return tasks; }
        public Task getTask(String taskId) { return tasks.get(taskId); }

        public static class Builder {
            private final String id;
            private String name;
            private final Map<String, Task> tasks = new LinkedHashMap<>();

            public Builder(String id) {
                this.id = id;
            }

            public Builder name(String name) {
                this.name = name;
                return this;
            }

            public Builder addTask(Task task) {
                if (tasks.containsKey(task.getId())) {
                    throw new IllegalArgumentException("Duplicate task id: " + task.getId());
                }
                tasks.put(task.getId(), task);
                return this;
            }

            public Workflow build() {
                Workflow workflow = new Workflow(this);
                DAGValidator.validate(workflow);
                return workflow;
            }
        }
    }

    public static class TaskResult {
        private final String taskId;
        private final TaskStatus status;
        private final Object output;
        private final Throwable error;
        private final int attempts;
        private final long durationMs;

        public TaskResult(String taskId, TaskStatus status, Object output, Throwable error, int attempts, long durationMs) {
            this.taskId = taskId;
            this.status = status;
            this.output = output;
            this.error = error;
            this.attempts = attempts;
            this.durationMs = durationMs;
        }

        public String getTaskId() { return taskId; }
        public TaskStatus getStatus() { return status; }
        public Object getOutput() { return output; }
        public Throwable getError() { return error; }
        public int getAttempts() { return attempts; }
        public long getDurationMs() { return durationMs; }

        @Override
        public String toString() {
            return String.format("TaskResult[id=%s, status=%s, attempts=%d, duration=%dms, error=%s]",
                    taskId, status, attempts, durationMs, error != null ? error.getMessage() : "none");
        }
    }

    public static class WorkflowExecutionResult {
        private final String workflowId;
        private final WorkflowStatus status;
        private final long startTimeMs;
        private final long endTimeMs;
        private final Map<String, TaskResult> taskResults;

        public WorkflowExecutionResult(String workflowId, WorkflowStatus status, long startTimeMs, long endTimeMs, Map<String, TaskResult> taskResults) {
            this.workflowId = workflowId;
            this.status = status;
            this.startTimeMs = startTimeMs;
            this.endTimeMs = endTimeMs;
            this.taskResults = Collections.unmodifiableMap(new LinkedHashMap<>(taskResults));
        }

        public String getWorkflowId() { return workflowId; }
        public WorkflowStatus getStatus() { return status; }
        public long getDurationMs() { return endTimeMs - startTimeMs; }
        public Map<String, TaskResult> getTaskResults() { return taskResults; }
        public TaskResult getTaskResult(String taskId) { return taskResults.get(taskId); }

        @Override
        public String toString() {
            StringBuilder sb = new StringBuilder();
            sb.append(String.format("\n=======================================================\n"));
            sb.append(String.format("🏁 Workflow Execution Result: %s [%s]\n", workflowId, status));
            sb.append(String.format("⏱️ Total Duration: %d ms\n", getDurationMs()));
            sb.append(String.format("📋 Task Breakdown (%d tasks):\n", taskResults.size()));
            taskResults.values().forEach(tr -> {
                String symbol = tr.getStatus() == TaskStatus.SUCCESS ? "✅" :
                                tr.getStatus() == TaskStatus.SKIPPED ? "⏭️" : "❌";
                sb.append(String.format("   %s %-10s -> %-10s (Attempts: %d, Duration: %4dms) %s\n",
                        symbol, tr.getTaskId(), tr.getStatus(), tr.getAttempts(), tr.getDurationMs(),
                        tr.getError() != null ? "[" + tr.getError().getMessage() + "]" : ""));
            });
            sb.append("=======================================================\n");
            return sb.toString();
        }
    }

    // =========================================================================
    // 2. DAG Validation & Cycle Detection (Kahn's Algorithm)
    // =========================================================================

    public static class DAGValidator {
        /**
         * Validates that:
         * 1. All referenced dependencies exist in the workflow.
         * 2. The graph contains NO directed cycles (using Kahn's Algorithm / Topological Sort).
         */
        public static void validate(Workflow workflow) {
            Map<String, Task> tasks = workflow.getTasks();
            if (tasks.isEmpty()) {
                throw new IllegalArgumentException("Workflow cannot be empty");
            }

            // 1. Verify existence of all dependencies
            for (Task task : tasks.values()) {
                for (String depId : task.getDependencies()) {
                    if (!tasks.containsKey(depId)) {
                        throw new IllegalArgumentException(String.format(
                                "Invalid dependency: Task '%s' depends on unknown task '%s'", task.getId(), depId));
                    }
                    if (depId.equals(task.getId())) {
                        throw new IllegalArgumentException(String.format(
                                "Self-dependency detected on task '%s'", task.getId()));
                    }
                }
            }

            // 2. Kahn's Algorithm for Cycle Detection
            Map<String, Integer> inDegree = new HashMap<>();
            Map<String, List<String>> downstream = new HashMap<>();

            for (String taskId : tasks.keySet()) {
                inDegree.put(taskId, tasks.get(taskId).getDependencies().size());
                downstream.put(taskId, new ArrayList<>());
            }

            for (Task task : tasks.values()) {
                for (String depId : task.getDependencies()) {
                    downstream.get(depId).add(task.getId());
                }
            }

            Queue<String> queue = new ArrayDeque<>();
            for (Map.Entry<String, Integer> entry : inDegree.entrySet()) {
                if (entry.getValue() == 0) {
                    queue.offer(entry.getKey());
                }
            }

            int visitedCount = 0;
            while (!queue.isEmpty()) {
                String current = queue.poll();
                visitedCount++;

                for (String child : downstream.get(current)) {
                    int remaining = inDegree.get(child) - 1;
                    inDegree.put(child, remaining);
                    if (remaining == 0) {
                        queue.offer(child);
                    }
                }
            }

            if (visitedCount != tasks.size()) {
                // Find cyclic nodes
                List<String> cyclicNodes = new ArrayList<>();
                for (Map.Entry<String, Integer> entry : inDegree.entrySet()) {
                    if (entry.getValue() > 0) {
                        cyclicNodes.add(entry.getKey());
                    }
                }
                throw new IllegalStateException(String.format(
                        "Directed Cycle detected in Workflow '%s'! Unresolvable tasks: %s",
                        workflow.getId(), cyclicNodes));
            }
        }
    }

    // =========================================================================
    // 3. High-Concurrency Execution Engine
    // =========================================================================

    public static class ExecutionEngine {
        private final ExecutorService workerPool;
        private final ScheduledExecutorService scheduler;
        private final ConcurrentHashMap<String, ExecutionContext> activeContexts = new ConcurrentHashMap<>();

        public ExecutionEngine(int corePoolSize) {
            this.workerPool = Executors.newFixedThreadPool(corePoolSize, new ThreadFactory() {
                private final AtomicInteger counter = new AtomicInteger(1);
                @Override
                public Thread newThread(Runnable r) {
                    Thread t = new Thread(r, "WorkflowWorker-" + counter.getAndIncrement());
                    t.setDaemon(true);
                    return t;
                }
            });

            this.scheduler = Executors.newScheduledThreadPool(4, new ThreadFactory() {
                private final AtomicInteger counter = new AtomicInteger(1);
                @Override
                public Thread newThread(Runnable r) {
                    Thread t = new Thread(r, "WorkflowScheduler-" + counter.getAndIncrement());
                    t.setDaemon(true);
                    return t;
                }
            });
        }

        public WorkflowExecutionResult submitWorkflow(Workflow workflow) {
            try {
                return submitWorkflowAsync(workflow).get();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Workflow execution interrupted", e);
            } catch (ExecutionException e) {
                throw new RuntimeException("Workflow execution failed", e.getCause());
            }
        }

        public CompletableFuture<WorkflowExecutionResult> submitWorkflowAsync(Workflow workflow) {
            ExecutionContext context = new ExecutionContext(workflow, this);
            activeContexts.put(workflow.getId(), context);
            return context.start();
        }

        public TaskStatus getTaskStatus(String workflowId, String taskId) {
            ExecutionContext ctx = activeContexts.get(workflowId);
            if (ctx == null) {
                throw new NoSuchElementException("Active workflow not found: " + workflowId);
            }
            return ctx.getTaskStatus(taskId);
        }

        public void cancelWorkflow(String workflowId) {
            ExecutionContext ctx = activeContexts.get(workflowId);
            if (ctx != null) {
                ctx.cancel();
            }
        }

        public void shutdown() {
            workerPool.shutdown();
            scheduler.shutdown();
            try {
                if (!workerPool.awaitTermination(5, TimeUnit.SECONDS)) {
                    workerPool.shutdownNow();
                }
                if (!scheduler.awaitTermination(5, TimeUnit.SECONDS)) {
                    scheduler.shutdownNow();
                }
            } catch (InterruptedException e) {
                workerPool.shutdownNow();
                scheduler.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }
    }

    // =========================================================================
    // 4. Execution Context & Resiliency Logic (Per-Workflow Instance)
    // =========================================================================

    private static class ExecutionContext {
        private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm:ss.SSS")
                .withZone(ZoneId.systemDefault());

        private final Workflow workflow;
        private final ExecutionEngine engine;
        private final long startTimeMs;
        private final CompletableFuture<WorkflowExecutionResult> completionFuture = new CompletableFuture<>();

        // Thread-safe state governance maps
        private final ConcurrentHashMap<String, AtomicReference<TaskStatus>> taskStatuses = new ConcurrentHashMap<>();
        private final ConcurrentHashMap<String, AtomicInteger> inDegreeMap = new ConcurrentHashMap<>();
        private final ConcurrentHashMap<String, AtomicInteger> attemptsMap = new ConcurrentHashMap<>();
        private final ConcurrentHashMap<String, Object> taskOutputs = new ConcurrentHashMap<>();
        private final ConcurrentHashMap<String, TaskResult> taskResults = new ConcurrentHashMap<>();
        private final ConcurrentHashMap<String, List<String>> downstreamMap = new ConcurrentHashMap<>();

        private final AtomicInteger remainingTerminalCount = new AtomicInteger(0);
        private final AtomicBoolean isCancelled = new AtomicBoolean(false);
        private final AtomicBoolean isCompleted = new AtomicBoolean(false);

        public ExecutionContext(Workflow workflow, ExecutionEngine engine) {
            this.workflow = workflow;
            this.engine = engine;
            this.startTimeMs = System.currentTimeMillis();

            int totalTasks = workflow.getTasks().size();
            this.remainingTerminalCount.set(totalTasks);

            // Initialize dependency graphs and state containers
            for (String taskId : workflow.getTasks().keySet()) {
                taskStatuses.put(taskId, new AtomicReference<>(TaskStatus.PENDING));
                attemptsMap.put(taskId, new AtomicInteger(0));
                downstreamMap.put(taskId, new CopyOnWriteArrayList<>());
                inDegreeMap.put(taskId, new AtomicInteger(workflow.getTask(taskId).getDependencies().size()));
            }

            for (Task task : workflow.getTasks().values()) {
                for (String depId : task.getDependencies()) {
                    downstreamMap.get(depId).add(task.getId());
                }
            }
        }

        public CompletableFuture<WorkflowExecutionResult> start() {
            log(String.format("🚀 [Workflow-%s] Initializing execution with %d tasks",
                    workflow.getId(), workflow.getTasks().size()));

            // Find all root tasks (in-degree == 0) and dispatch concurrently
            List<String> rootTasks = new ArrayList<>();
            for (Map.Entry<String, AtomicInteger> entry : inDegreeMap.entrySet()) {
                if (entry.getValue().get() == 0) {
                    rootTasks.add(entry.getKey());
                }
            }

            if (rootTasks.isEmpty()) {
                finishWorkflow(WorkflowStatus.FAILED);
                return completionFuture;
            }

            for (String rootTaskId : rootTasks) {
                transitionTask(rootTaskId, TaskStatus.PENDING, TaskStatus.READY);
                dispatchTask(rootTaskId);
            }

            return completionFuture;
        }

        private void dispatchTask(String taskId) {
            if (isCancelled.get()) return;

            engine.workerPool.submit(() -> executeTaskAttempt(taskId));
        }

        private void executeTaskAttempt(String taskId) {
            if (isCancelled.get()) return;

            Task task = workflow.getTask(taskId);
            int currentAttempt = attemptsMap.get(taskId).incrementAndGet();

            transitionTask(taskId, getTaskStatus(taskId), TaskStatus.RUNNING,
                    String.format("(Attempt %d of %d)", currentAttempt, task.getMaxRetries() + 1));

            long taskStartMs = System.currentTimeMillis();
            try {
                // Prepare upstream inputs
                Map<String, Object> upstreamData = new HashMap<>();
                for (String depId : task.getDependencies()) {
                    Object val = taskOutputs.get(depId);
                    if (val != null) {
                        upstreamData.put(depId, val);
                    }
                }

                TaskContext context = new TaskContext(workflow.getId(), taskId, currentAttempt, upstreamData);
                Object result = task.getAction().execute(context);

                // Success
                long duration = System.currentTimeMillis() - taskStartMs;
                if (result != null) {
                    taskOutputs.put(taskId, result);
                }

                transitionTask(taskId, TaskStatus.RUNNING, TaskStatus.SUCCESS,
                        String.format("(Completed in %d ms)", duration));

                taskResults.put(taskId, new TaskResult(taskId, TaskStatus.SUCCESS, result, null, currentAttempt, duration));
                onTaskTerminalSuccess(taskId);

            } catch (Throwable t) {
                long duration = System.currentTimeMillis() - taskStartMs;

                if (currentAttempt <= task.getMaxRetries() && !isCancelled.get()) {
                    // Retryable
                    long backoffDelay = calculateBackoff(task, currentAttempt);
                    transitionTask(taskId, TaskStatus.RUNNING, TaskStatus.RETRYING,
                            String.format("(Error: %s. Retrying in %d ms...)", t.getMessage(), backoffDelay));

                    engine.scheduler.schedule(() -> {
                        if (!isCancelled.get()) {
                            transitionTask(taskId, TaskStatus.RETRYING, TaskStatus.READY);
                            dispatchTask(taskId);
                        }
                    }, backoffDelay, TimeUnit.MILLISECONDS);

                } else {
                    // Definitively Failed -> Trigger Cascading Skips
                    transitionTask(taskId, TaskStatus.RUNNING, TaskStatus.FAILED,
                            String.format("(Retries exhausted. Error: %s)", t.getMessage()));

                    taskResults.put(taskId, new TaskResult(taskId, TaskStatus.FAILED, null, t, currentAttempt, duration));
                    onTaskTerminalDefinitiveFailure(taskId, t);
                }
            }
        }

        private long calculateBackoff(Task task, int attempt) {
            double raw = task.getInitialBackoffMs() * Math.pow(task.getBackoffMultiplier(), attempt - 1);
            long capped = Math.min((long) raw, task.getMaxBackoffMs());
            // Add jitter (+/- 15%)
            double jitter = (ThreadLocalRandom.current().nextDouble() * 0.30) - 0.15;
            return Math.max(10, (long) (capped * (1.0 + jitter)));
        }

        /**
         * Upon task SUCCESS, decrement in-degree of all direct downstream children.
         * When in-degree hits 0, child is immediately ready to run!
         */
        private void onTaskTerminalSuccess(String completedTaskId) {
            List<String> children = downstreamMap.get(completedTaskId);
            if (children != null) {
                for (String childId : children) {
                    AtomicInteger childInDegree = inDegreeMap.get(childId);
                    int remaining = childInDegree.decrementAndGet();

                    if (remaining == 0) {
                        // Check if child is still PENDING (not skipped by another failure)
                        AtomicReference<TaskStatus> statusRef = taskStatuses.get(childId);
                        if (statusRef.compareAndSet(TaskStatus.PENDING, TaskStatus.READY)) {
                            logTransition(childId, TaskStatus.PENDING, TaskStatus.READY, "(All dependencies satisfied)");
                            dispatchTask(childId);
                        }
                    }
                }
            }

            checkWorkflowTermination();
        }

        /**
         * Cascading Failure Management:
         * Walks the remaining DAG reachable from this failed task, marking all downstream
         * tasks as SKIPPED and preventing them from ever entering execution pools.
         */
        private void onTaskTerminalDefinitiveFailure(String failedTaskId, Throwable cause) {
            Set<String> downstreamToSkip = new LinkedHashSet<>();
            Queue<String> queue = new ArrayDeque<>();
            queue.offer(failedTaskId);

            while (!queue.isEmpty()) {
                String parent = queue.poll();
                List<String> children = downstreamMap.get(parent);
                if (children != null) {
                    for (String child : children) {
                        if (downstreamToSkip.add(child)) {
                            queue.offer(child);
                        }
                    }
                }
            }

            // Atomically prune all downstream tasks
            for (String skipTaskId : downstreamToSkip) {
                AtomicReference<TaskStatus> statusRef = taskStatuses.get(skipTaskId);
                TaskStatus prev = statusRef.getAndSet(TaskStatus.SKIPPED);

                if (prev != TaskStatus.SKIPPED) {
                    logTransition(skipTaskId, prev, TaskStatus.SKIPPED,
                            String.format("(Cascaded prune: upstream '%s' failed)", failedTaskId));

                    taskResults.put(skipTaskId, new TaskResult(
                            skipTaskId,
                            TaskStatus.SKIPPED,
                            null,
                            new RuntimeException("Skipped due to upstream failure in task: " + failedTaskId, cause),
                            0,
                            0
                    ));

                    // Decrement remaining count since this skipped task is now in a terminal state
                    remainingTerminalCount.decrementAndGet();
                }
            }

            checkWorkflowTermination();
        }

        private void checkWorkflowTermination() {
            int remaining = remainingTerminalCount.decrementAndGet();
            if (remaining <= 0) {
                // All tasks have reached terminal status
                boolean anyFailed = taskResults.values().stream()
                        .anyMatch(tr -> tr.getStatus() == TaskStatus.FAILED);

                finishWorkflow(anyFailed ? WorkflowStatus.FAILED : WorkflowStatus.SUCCESS);
            }
        }

        private void finishWorkflow(WorkflowStatus finalStatus) {
            if (isCompleted.compareAndSet(false, true)) {
                long endTimeMs = System.currentTimeMillis();
                WorkflowExecutionResult result = new WorkflowExecutionResult(
                        workflow.getId(),
                        finalStatus,
                        startTimeMs,
                        endTimeMs,
                        taskResults
                );
                completionFuture.complete(result);
            }
        }

        public void cancel() {
            if (isCancelled.compareAndSet(false, true)) {
                log(String.format("🛑 [Workflow-%s] Cancellation triggered!", workflow.getId()));

                for (Map.Entry<String, AtomicReference<TaskStatus>> entry : taskStatuses.entrySet()) {
                    String tId = entry.getKey();
                    AtomicReference<TaskStatus> ref = entry.getValue();
                    TaskStatus current = ref.get();
                    if (!current.isTerminal()) {
                        ref.set(TaskStatus.CANCELLED);
                        taskResults.put(tId, new TaskResult(tId, TaskStatus.CANCELLED, null,
                                new CancellationException("Workflow was cancelled"), attemptsMap.get(tId).get(), 0));
                    }
                }

                finishWorkflow(WorkflowStatus.CANCELLED);
            }
        }

        public TaskStatus getTaskStatus(String taskId) {
            AtomicReference<TaskStatus> ref = taskStatuses.get(taskId);
            return ref != null ? ref.get() : null;
        }

        private void transitionTask(String taskId, TaskStatus from, TaskStatus to) {
            transitionTask(taskId, from, to, "");
        }

        private void transitionTask(String taskId, TaskStatus from, TaskStatus to, String detail) {
            AtomicReference<TaskStatus> ref = taskStatuses.get(taskId);
            ref.set(to);
            logTransition(taskId, from, to, detail);
        }

        private void logTransition(String taskId, TaskStatus from, TaskStatus to, String detail) {
            String timestamp = TIME_FMT.format(Instant.now());
            String threadName = Thread.currentThread().getName();
            System.out.printf("[%s] [%-18s] [Workflow-%s] [Task-%-4s] %-8s ➔ %-8s %s%n",
                    timestamp, threadName, workflow.getId(), taskId, from, to, detail);
        }

        private void log(String msg) {
            String timestamp = TIME_FMT.format(Instant.now());
            System.out.printf("[%s] %s%n", timestamp, msg);
        }
    }

    // =========================================================================
    // 5. Production Demonstration Driver (5+ Node Complex DAG)
    // =========================================================================

    public static void main(String[] args) {
        System.out.println("=======================================================");
        System.out.println("⚡ High-Concurrency Dynamic DAG Workflow Execution Engine");
        System.out.println("=======================================================\n");

        ExecutionEngine engine = new ExecutionEngine(8);

        /*
         * Complex 7-Node DAG Architecture:
         *
         *           [ Task A: Ingest ]
         *             /            \
         *            v              v
         *   [ Task B: Clean ]     [ Task C: Validate ]
         *        (retried)               |
         *           |                    v
         *           v             [ Task D: FraudCheck ]
         *   [ Task G: Transform ]     (fails definitively)
         *      (independent)             |
         *                                v
         *                         [ Task E: Settle ] (SKIPPED)
         *                                |
         *                                v
         *                         [ Task F: Notify ] (SKIPPED)
         */

        Workflow workflow = new Workflow.Builder("WF_FINANCIAL_SETTLEMENT_001")
                .name("Order Settlement & Fraud Inspection Pipeline")

                // Root Task A
                .addTask(new Task.Builder("A")
                        .name("Data Ingestion")
                        .action(ctx -> {
                            Thread.sleep(120);
                            return "RawPayload{tx_id=99281, amount=$4500.00}";
                        })
                        .build())

                // Task B: Depends on A, fails on attempt 1, succeeds on attempt 2 (Retry demonstrated)
                .addTask(new Task.Builder("B")
                        .name("Data Cleaning")
                        .dependsOn("A")
                        .retries(2, 80, 2.0, 500)
                        .action(ctx -> {
                            Thread.sleep(100);
                            if (ctx.getAttempt() == 1) {
                                throw new RuntimeException("Transient Socket Timeout to Cleaning Microservice");
                            }
                            return "CleanedPayload{valid=true}";
                        })
                        .build())

                // Task C: Depends on A, runs concurrently with B, succeeds quickly
                .addTask(new Task.Builder("C")
                        .name("Format Validation")
                        .dependsOn("A")
                        .action(ctx -> {
                            Thread.sleep(80);
                            return "ValidationResult{schema=v2, passed=true}";
                        })
                        .build())

                // Task G: Depends on B, independent parallel branch from failure
                .addTask(new Task.Builder("G")
                        .name("Transform & Load")
                        .dependsOn("B")
                        .action(ctx -> {
                            Thread.sleep(150);
                            return "TransformedRecords{count=100}";
                        })
                        .build())

                // Task D: Depends on C, fails repeatedly until retries exhausted!
                .addTask(new Task.Builder("D")
                        .name("Fraud Scoring")
                        .dependsOn("C")
                        .retries(2, 60, 1.5, 300)
                        .action(ctx -> {
                            Thread.sleep(90);
                            throw new RuntimeException("Permanent Sanction Check Service 503 Service Unavailable");
                        })
                        .build())

                // Task E: Depends on D (Downstream of failure -> CASCADING PRUNED/SKIPPED)
                .addTask(new Task.Builder("E")
                        .name("Funds Settlement")
                        .dependsOn("D")
                        .action(ctx -> {
                            Thread.sleep(100);
                            return "Settled{cleared=true}";
                        })
                        .build())

                // Task F: Depends on E (Transitive downstream of failure -> CASCADING PRUNED/SKIPPED)
                .addTask(new Task.Builder("F")
                        .name("Customer Notification")
                        .dependsOn("E")
                        .action(ctx -> {
                            Thread.sleep(50);
                            return "Notified{sms=sent}";
                        })
                        .build())

                .build();

        // Submit and wait for workflow execution result
        WorkflowExecutionResult result = engine.submitWorkflow(workflow);

        System.out.println(result);

        engine.shutdown();
    }
}
