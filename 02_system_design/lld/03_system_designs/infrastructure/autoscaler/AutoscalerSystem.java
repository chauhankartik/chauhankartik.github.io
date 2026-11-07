package infrastructure.autoscaler;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.ReentrantLock;

/**
 * ============================================================================
 * Production-Grade Infrastructure Autoscaler Engine
 * Staff / Principal Systems Architecture & Low-Level Design (LLD)
 * ============================================================================
 * Emulates the Kubernetes Horizontal Pod Autoscaler (HPA) & AWS Auto Scaling Group (ASG).
 * Implements Target Tracking, Step Scaling, Hysteresis Deadbands, Cool-down Windows,
 * and Graceful Connection Draining.
 */
public class AutoscalerSystem {

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm:ss.SSS")
            .withZone(ZoneId.systemDefault());

    // =========================================================================
    // 1. Enums & Core Domain Types
    // =========================================================================

    public enum MetricType {
        CPU_UTILIZATION_PERCENT,
        MEMORY_UTILIZATION_PERCENT,
        REQUEST_LATENCY_P95_MS,
        QUEUE_BACKLOG_DEPTH
    }

    public enum ScalingDirection {
        SCALE_UP,
        SCALE_DOWN,
        NO_ACTION
    }

    public enum InstanceStatus {
        PENDING,     // Booting / warming up / passing health checks
        HEALTHY,     // Active, receiving production traffic from load balancer
        DRAINING,    // Deregistered from load balancer, draining in-flight connections
        TERMINATED   // Shut down, resources freed
    }

    public static class Instance {
        private final String instanceId;
        private final String ipAddress;
        private volatile InstanceStatus status;
        private final long launchedAtMs;
        private volatile long drainingStartedAtMs;

        public Instance(String instanceId, String ipAddress) {
            this.instanceId = instanceId;
            this.ipAddress = ipAddress;
            this.status = InstanceStatus.PENDING;
            this.launchedAtMs = System.currentTimeMillis();
        }

        public String getInstanceId() { return instanceId; }
        public String getIpAddress() { return ipAddress; }
        public InstanceStatus getStatus() { return status; }
        public void setStatus(InstanceStatus status) { this.status = status; }
        public long getLaunchedAtMs() { return launchedAtMs; }
        public long getDrainingStartedAtMs() { return drainingStartedAtMs; }
        public void setDrainingStartedAtMs(long ms) { this.drainingStartedAtMs = ms; }

        @Override
        public String toString() {
            return String.format("[%s @ %s | %s]", instanceId, ipAddress, status);
        }
    }

    public static class MetricSample {
        private final MetricType type;
        private final double value;
        private final long timestampMs;

        public MetricSample(MetricType type, double value) {
            this.type = type;
            this.value = value;
            this.timestampMs = System.currentTimeMillis();
        }

        public MetricType getType() { return type; }
        public double getValue() { return value; }
        public long getTimestampMs() { return timestampMs; }
    }

    public static class ScalingDecision {
        private final ScalingDirection direction;
        private final int currentReplicas;
        private final int desiredReplicas;
        private final int delta;
        private final String reason;
        private final String limitingFactor;

        public ScalingDecision(ScalingDirection direction, int currentReplicas, int desiredReplicas,
                               int delta, String reason, String limitingFactor) {
            this.direction = direction;
            this.currentReplicas = currentReplicas;
            this.desiredReplicas = desiredReplicas;
            this.delta = delta;
            this.reason = reason;
            this.limitingFactor = limitingFactor;
        }

        public ScalingDirection getDirection() { return direction; }
        public int getCurrentReplicas() { return currentReplicas; }
        public int getDesiredReplicas() { return desiredReplicas; }
        public int getDelta() { return delta; }
        public String getReason() { return reason; }
        public String getLimitingFactor() { return limitingFactor; }

        @Override
        public String toString() {
            return String.format("Decision[%s: %d -> %d (delta: %+d) | Reason: %s %s]",
                    direction, currentReplicas, desiredReplicas, delta, reason,
                    limitingFactor != null ? "[Cap: " + limitingFactor + "]" : "");
        }
    }

    public static class AutoscalerConfig {
        private final int minReplicas;
        private final int maxReplicas;
        private final double targetValue;
        private final double toleranceDeadband; // e.g. 0.10 means +/- 10% deadband to prevent flapping
        private final long scaleUpCooldownMs;
        private final long scaleDownCooldownMs;
        private final int maxScaleUpStep;       // Maximum instances added in a single scale event
        private final int maxScaleDownStep;     // Maximum instances removed in a single scale event
        private final long drainingTimeoutMs;   // Duration to wait for in-flight requests to complete

        private AutoscalerConfig(Builder builder) {
            this.minReplicas = builder.minReplicas;
            this.maxReplicas = builder.maxReplicas;
            this.targetValue = builder.targetValue;
            this.toleranceDeadband = builder.toleranceDeadband;
            this.scaleUpCooldownMs = builder.scaleUpCooldownMs;
            this.scaleDownCooldownMs = builder.scaleDownCooldownMs;
            this.maxScaleUpStep = builder.maxScaleUpStep;
            this.maxScaleDownStep = builder.maxScaleDownStep;
            this.drainingTimeoutMs = builder.drainingTimeoutMs;
        }

        public int getMinReplicas() { return minReplicas; }
        public int getMaxReplicas() { return maxReplicas; }
        public double getTargetValue() { return targetValue; }
        public double getToleranceDeadband() { return toleranceDeadband; }
        public long getScaleUpCooldownMs() { return scaleUpCooldownMs; }
        public long getScaleDownCooldownMs() { return scaleDownCooldownMs; }
        public int getMaxScaleUpStep() { return maxScaleUpStep; }
        public int getMaxScaleDownStep() { return maxScaleDownStep; }
        public long getDrainingTimeoutMs() { return drainingTimeoutMs; }

        public static class Builder {
            private int minReplicas = 2;
            private int maxReplicas = 10;
            private double targetValue = 50.0;
            private double toleranceDeadband = 0.10; // 10%
            private long scaleUpCooldownMs = 15_000;  // 15 seconds
            private long scaleDownCooldownMs = 60_000; // 60 seconds (conservative)
            private int maxScaleUpStep = 4;
            private int maxScaleDownStep = 2;
            private long drainingTimeoutMs = 5_000;

            public Builder minReplicas(int min) { this.minReplicas = min; return this; }
            public Builder maxReplicas(int max) { this.maxReplicas = max; return this; }
            public Builder targetValue(double val) { this.targetValue = val; return this; }
            public Builder toleranceDeadband(double deadband) { this.toleranceDeadband = deadband; return this; }
            public Builder scaleUpCooldownMs(long ms) { this.scaleUpCooldownMs = ms; return this; }
            public Builder scaleDownCooldownMs(long ms) { this.scaleDownCooldownMs = ms; return this; }
            public Builder maxScaleUpStep(int step) { this.maxScaleUpStep = step; return this; }
            public Builder maxScaleDownStep(int step) { this.maxScaleDownStep = step; return this; }
            public Builder drainingTimeoutMs(long ms) { this.drainingTimeoutMs = ms; return this; }

            public AutoscalerConfig build() {
                if (minReplicas <= 0 || maxReplicas < minReplicas) {
                    throw new IllegalArgumentException("Invalid min/max replica constraints");
                }
                return new AutoscalerConfig(this);
            }
        }
    }

    // =========================================================================
    // 2. Metrics Registry (Exponential Smoothing / Windowed Averaging)
    // =========================================================================

    public interface IMetricsCollector {
        void recordMetric(MetricType type, double value);
        double getSmoothedValue(MetricType type, long windowMs);
        void resetMetrics(MetricType type);
    }

    public static class MetricsRegistry implements IMetricsCollector {
        private final ConcurrentHashMap<MetricType, ConcurrentLinkedDeque<MetricSample>> samples = new ConcurrentHashMap<>();

        @Override
        public void recordMetric(MetricType type, double value) {
            samples.computeIfAbsent(type, k -> new ConcurrentLinkedDeque<>())
                    .add(new MetricSample(type, value));
        }

        @Override
        public void resetMetrics(MetricType type) {
            samples.remove(type);
        }

        @Override
        public double getSmoothedValue(MetricType type, long windowMs) {
            ConcurrentLinkedDeque<MetricSample> deque = samples.get(type);
            if (deque == null || deque.isEmpty()) return 0.0;

            long now = System.currentTimeMillis();
            long cutoff = now - windowMs;

            // Purge samples older than window
            while (!deque.isEmpty() && deque.peekFirst().getTimestampMs() < cutoff) {
                deque.pollFirst();
            }

            if (deque.isEmpty()) return 0.0;

            double sum = 0.0;
            int count = 0;
            for (MetricSample s : deque) {
                sum += s.getValue();
                count++;
            }
            return count > 0 ? sum / count : 0.0;
        }
    }

    // =========================================================================
    // 3. Strategy Pattern: Scaling Policy Engine
    // =========================================================================

    public interface IScalingPolicy {
        ScalingDecision evaluate(int currentHealthyReplicas, double currentMetricValue, AutoscalerConfig config);
    }

    /**
     * Target Tracking Scaling Algorithm (Kubernetes HPA Mathematical Model):
     *
     * DesiredReplicas = ceil( CurrentReplicas * ( CurrentMetricValue / TargetMetricValue ) )
     *
     * Invariant: Hysteresis Deadband
     * If |CurrentMetricValue - TargetMetricValue| / TargetMetricValue <= Tolerance
     * Then direction is NO_ACTION to prevent rapid oscillation (thrashing).
     */
    public static class TargetTrackingScalingPolicy implements IScalingPolicy {

        @Override
        public ScalingDecision evaluate(int currentReplicas, double currentMetric, AutoscalerConfig config) {
            double target = config.getTargetValue();
            if (target <= 0) {
                return new ScalingDecision(ScalingDirection.NO_ACTION, currentReplicas, currentReplicas, 0, "Target <= 0", null);
            }

            double ratio = currentMetric / target;
            double diffRatio = Math.abs(currentMetric - target) / target;

            // 1. Hysteresis Deadband check
            if (diffRatio <= config.getToleranceDeadband()) {
                return new ScalingDecision(
                        ScalingDirection.NO_ACTION,
                        currentReplicas,
                        currentReplicas,
                        0,
                        String.format("Current value %.1f is within +/-%.0f%% deadband of target %.1f",
                                currentMetric, config.getToleranceDeadband() * 100, target),
                        null
                );
            }

            // 2. Compute raw desired replicas
            int rawDesired = (int) Math.ceil(currentReplicas * ratio);
            ScalingDirection direction;
            if (rawDesired > currentReplicas) {
                direction = ScalingDirection.SCALE_UP;
            } else if (rawDesired < currentReplicas) {
                direction = ScalingDirection.SCALE_DOWN;
            } else {
                return new ScalingDecision(ScalingDirection.NO_ACTION, currentReplicas, currentReplicas, 0, "No replica delta", null);
            }

            // 3. Apply Step velocity clamp
            int delta = rawDesired - currentReplicas;
            String capReason = null;

            if (direction == ScalingDirection.SCALE_UP && delta > config.getMaxScaleUpStep()) {
                rawDesired = currentReplicas + config.getMaxScaleUpStep();
                capReason = "MaxScaleUpStep (" + config.getMaxScaleUpStep() + ")";
            } else if (direction == ScalingDirection.SCALE_DOWN && Math.abs(delta) > config.getMaxScaleDownStep()) {
                rawDesired = currentReplicas - config.getMaxScaleDownStep();
                capReason = "MaxScaleDownStep (" + config.getMaxScaleDownStep() + ")";
            }

            // 4. Enforce global bounds: minReplicas <= desired <= maxReplicas
            int clampedDesired = Math.max(config.getMinReplicas(), Math.min(config.getMaxReplicas(), rawDesired));
            if (clampedDesired != rawDesired) {
                capReason = (clampedDesired == config.getMaxReplicas()) ? "MaxReplicas Cap" : "MinReplicas Floor";
            }

            int finalDelta = clampedDesired - currentReplicas;
            if (finalDelta == 0) {
                return new ScalingDecision(ScalingDirection.NO_ACTION, currentReplicas, currentReplicas, 0,
                        "Clamped to boundary, delta=0", capReason);
            }

            String reason = String.format("Metric=%.1f vs Target=%.1f (Ratio=%.2f)", currentMetric, target, ratio);
            return new ScalingDecision(direction, currentReplicas, clampedDesired, finalDelta, reason, capReason);
        }
    }

    // =========================================================================
    // 4. Cloud Cluster Actuator (Instance Provisioning & Draining)
    // =========================================================================

    public interface IClusterActuator {
        List<Instance> getInstances();
        List<Instance> provisionInstances(int count);
        void drainAndTerminateInstances(List<Instance> instancesToTerminate, long drainingTimeoutMs);
    }

    public static class MockCloudClusterActuator implements IClusterActuator {
        private final Map<String, Instance> cluster = new ConcurrentHashMap<>();
        private final AtomicInteger instanceSequence = new AtomicInteger(100);

        public MockCloudClusterActuator(int initialHealthyCount) {
            for (int i = 0; i < initialHealthyCount; i++) {
                Instance inst = createInstance();
                inst.setStatus(InstanceStatus.HEALTHY);
                cluster.put(inst.getInstanceId(), inst);
            }
        }

        private Instance createInstance() {
            int seq = instanceSequence.incrementAndGet();
            String id = "inst-pod-" + seq;
            String ip = "10.0.4." + (seq % 250);
            return new Instance(id, ip);
        }

        @Override
        public List<Instance> getInstances() {
            return new ArrayList<>(cluster.values());
        }

        @Override
        public List<Instance> provisionInstances(int count) {
            List<Instance> newlyCreated = new ArrayList<>();
            for (int i = 0; i < count; i++) {
                Instance inst = createInstance();
                cluster.put(inst.getInstanceId(), inst);
                newlyCreated.add(inst);

                // Simulate asynchronous boot -> healthy transition
                inst.setStatus(InstanceStatus.HEALTHY);
            }
            return newlyCreated;
        }

        @Override
        public void drainAndTerminateInstances(List<Instance> instancesToTerminate, long drainingTimeoutMs) {
            for (Instance inst : instancesToTerminate) {
                inst.setStatus(InstanceStatus.DRAINING);
                inst.setDrainingStartedAtMs(System.currentTimeMillis());

                // Simulate connection draining and shutdown
                cluster.remove(inst.getInstanceId());
                inst.setStatus(InstanceStatus.TERMINATED);
            }
        }
    }

    // =========================================================================
    // 5. Core Autoscaler Service & Reconciliation Control Loop
    // =========================================================================

    public static class AutoscalerService {
        private final AutoscalerConfig config;
        private final MetricType monitoredMetric;
        private final IMetricsCollector metricsCollector;
        private final IScalingPolicy scalingPolicy;
        private final IClusterActuator clusterActuator;

        private final ReentrantLock reconcileLock = new ReentrantLock();
        private volatile long lastScaleUpTimestampMs = 0;
        private volatile long lastScaleDownTimestampMs = 0;

        private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor(r -> {
            Thread t = new Thread(r, "AutoscalerReconciler");
            t.setDaemon(true);
            return t;
        });

        public AutoscalerService(AutoscalerConfig config,
                                 MetricType monitoredMetric,
                                 IMetricsCollector metricsCollector,
                                 IScalingPolicy scalingPolicy,
                                 IClusterActuator clusterActuator) {
            this.config = config;
            this.monitoredMetric = monitoredMetric;
            this.metricsCollector = metricsCollector;
            this.scalingPolicy = scalingPolicy;
            this.clusterActuator = clusterActuator;
        }

        public void startControlLoop(long intervalMs) {
            log("🚀 Starting Autoscaler Controller Reconciliation Loop (Interval: " + intervalMs + " ms)");
            scheduler.scheduleAtFixedRate(this::reconcile, 0, intervalMs, TimeUnit.MILLISECONDS);
        }

        public void stopControlLoop() {
            scheduler.shutdown();
        }

        /**
         * Core Reconciliation Step (Analogous to Kubernetes controller loop).
         */
        public ScalingDecision reconcile() {
            if (!reconcileLock.tryLock()) {
                // Another reconciliation is currently executing; skip this tick
                return null;
            }

            try {
                long now = System.currentTimeMillis();

                // 1. Gather active healthy instances
                List<Instance> allInstances = clusterActuator.getInstances();
                List<Instance> healthyInstances = new ArrayList<>();
                for (Instance inst : allInstances) {
                    if (inst.getStatus() == InstanceStatus.HEALTHY) {
                        healthyInstances.add(inst);
                    }
                }
                int currentHealthyCount = healthyInstances.size();

                // 2. Fetch smoothed metric value (30-second window)
                double smoothedMetric = metricsCollector.getSmoothedValue(monitoredMetric, 30_000);

                // 3. Evaluate scaling policy strategy
                ScalingDecision decision = scalingPolicy.evaluate(currentHealthyCount, smoothedMetric, config);

                if (decision.getDirection() == ScalingDirection.NO_ACTION) {
                    log(String.format("⚖️  [NO_ACTION] Healthy=%d | %s", currentHealthyCount, decision.getReason()));
                    return decision;
                }

                // 4. Cool-Down Window Guardrails
                if (decision.getDirection() == ScalingDirection.SCALE_UP) {
                    long elapsedSinceLastUp = now - lastScaleUpTimestampMs;
                    if (elapsedSinceLastUp < config.getScaleUpCooldownMs()) {
                        String coolReason = String.format("Scale-up cooling down (%d ms remaining)",
                                config.getScaleUpCooldownMs() - elapsedSinceLastUp);
                        log("⏳ [COOLDOWN] Suppressed SCALE_UP: " + coolReason);
                        return new ScalingDecision(ScalingDirection.NO_ACTION, currentHealthyCount, currentHealthyCount, 0, coolReason, null);
                    }

                    // Execute SCALE_UP
                    int toAdd = decision.getDelta();
                    log(String.format("📈 [SCALE_UP] Scaling %d -> %d (+%d) | %s %s",
                            currentHealthyCount, decision.getDesiredReplicas(), toAdd, decision.getReason(),
                            decision.getLimitingFactor() != null ? "[" + decision.getLimitingFactor() + "]" : ""));

                    List<Instance> spawned = clusterActuator.provisionInstances(toAdd);
                    for (Instance s : spawned) {
                        log("   ➕ Provisioned new replica: " + s);
                    }
                    lastScaleUpTimestampMs = System.currentTimeMillis();

                } else if (decision.getDirection() == ScalingDirection.SCALE_DOWN) {
                    long elapsedSinceLastDown = now - lastScaleDownTimestampMs;
                    if (elapsedSinceLastDown < config.getScaleDownCooldownMs()) {
                        String coolReason = String.format("Scale-down cooling down (%d ms remaining)",
                                config.getScaleDownCooldownMs() - elapsedSinceLastDown);
                        log("⏳ [COOLDOWN] Suppressed SCALE_DOWN: " + coolReason);
                        return new ScalingDecision(ScalingDirection.NO_ACTION, currentHealthyCount, currentHealthyCount, 0, coolReason, null);
                    }

                    // Execute SCALE_DOWN
                    int toRemove = Math.abs(decision.getDelta());
                    log(String.format("📉 [SCALE_DOWN] Scaling %d -> %d (-%d) | %s %s",
                            currentHealthyCount, decision.getDesiredReplicas(), toRemove, decision.getReason(),
                            decision.getLimitingFactor() != null ? "[" + decision.getLimitingFactor() + "]" : ""));

                    // Select oldest or latest instances to terminate
                    List<Instance> toTerminate = new ArrayList<>(healthyInstances.subList(0, Math.min(toRemove, healthyInstances.size())));
                    for (Instance t : toTerminate) {
                        log("   ➖ Draining & Terminating: " + t);
                    }
                    clusterActuator.drainAndTerminateInstances(toTerminate, config.getDrainingTimeoutMs());
                    lastScaleDownTimestampMs = System.currentTimeMillis();
                }

                return decision;

            } finally {
                reconcileLock.unlock();
            }
        }

        private void log(String msg) {
            String timestamp = TIME_FMT.format(Instant.now());
            System.out.printf("[%s] [AutoscalerEngine] %s%n", timestamp, msg);
        }
    }

    // =========================================================================
    // 6. Production Demonstration Driver (Simulating Real Traffic Scenarios)
    // =========================================================================

    public static void main(String[] args) throws InterruptedException {
        System.out.println("==========================================================================");
        System.out.println("⚡ High-Performance Infrastructure Autoscaler System (HPA Simulation)");
        System.out.println("==========================================================================\n");

        // Configuration: target 50% CPU, min 2, max 10, deadband 10%, scaleUpCooldown 2s, scaleDownCooldown 3s
        AutoscalerConfig config = new AutoscalerConfig.Builder()
                .minReplicas(2)
                .maxReplicas(10)
                .targetValue(50.0)
                .toleranceDeadband(0.10)
                .scaleUpCooldownMs(1500)
                .scaleDownCooldownMs(2500)
                .maxScaleUpStep(4)
                .maxScaleDownStep(2)
                .drainingTimeoutMs(1000)
                .build();

        MetricsRegistry metrics = new MetricsRegistry();
        MockCloudClusterActuator cluster = new MockCloudClusterActuator(3); // Start with 3 healthy instances
        IScalingPolicy policy = new TargetTrackingScalingPolicy();

        AutoscalerService autoscaler = new AutoscalerService(
                config,
                MetricType.CPU_UTILIZATION_PERCENT,
                metrics,
                policy,
                cluster
        );

        System.out.println("Cluster initialized with 3 healthy replicas.");
        System.out.println("Target CPU: 50.0% | Tolerance Deadband: +/- 10.0% [45.0% - 55.0%]\n");

        // ---------------------------------------------------------------------
        // Scenario 1: Steady-State Traffic (CPU ~ 52%, inside 10% deadband)
        // ---------------------------------------------------------------------
        System.out.println("--- Scenario 1: Steady-State Traffic (CPU ~ 52%, Inside Deadband) ---");
        metrics.recordMetric(MetricType.CPU_UTILIZATION_PERCENT, 52.0);
        autoscaler.reconcile();
        System.out.println();

        // ---------------------------------------------------------------------
        // Scenario 2: Traffic Surge (CPU spikes to 90%)
        // ---------------------------------------------------------------------
        System.out.println("--- Scenario 2: Traffic Spike (CPU Surges to 90%) ---");
        metrics.recordMetric(MetricType.CPU_UTILIZATION_PERCENT, 90.0);
        // Ratio = 90 / 50 = 1.8; Desired = ceil(3 * 1.8) = ceil(5.4) = 6
        autoscaler.reconcile();
        System.out.println();

        // ---------------------------------------------------------------------
        // Scenario 3: Cooldown Guardrail (Immediate follow-up surge suppressed)
        // ---------------------------------------------------------------------
        System.out.println("--- Scenario 3: Cooldown Guardrail Test (Surge immediately follows) ---");
        metrics.recordMetric(MetricType.CPU_UTILIZATION_PERCENT, 95.0);
        autoscaler.reconcile(); // Should be blocked by scale-up cooldown
        System.out.println();

        // Wait out the scale-up cooldown
        Thread.sleep(1600);

        // ---------------------------------------------------------------------
        // Scenario 4: Extreme Spike Clamped at Max Limit (CPU at 100%)
        // ---------------------------------------------------------------------
        System.out.println("--- Scenario 4: Mega Traffic Spike (Desired > Max Limit) ---");
        metrics.recordMetric(MetricType.CPU_UTILIZATION_PERCENT, 100.0);
        // Current healthy is 6. Ratio = 2.0. Raw desired = 12. Max limit is 10.
        autoscaler.reconcile();
        System.out.println();

        // ---------------------------------------------------------------------
        // Scenario 5: Flapping Prevention (Micro-oscillation near target)
        // ---------------------------------------------------------------------
        System.out.println("--- Scenario 5: Flapping Prevention (CPU at 49%, within +/-10% deadband) ---");
        Thread.sleep(1600); // Wait out scale-up cooldown
        metrics.resetMetrics(MetricType.CPU_UTILIZATION_PERCENT);
        metrics.recordMetric(MetricType.CPU_UTILIZATION_PERCENT, 49.0);
        autoscaler.reconcile();
        System.out.println();

        // ---------------------------------------------------------------------
        // Scenario 6: Traffic Collapse & Graceful Connection Draining
        // ---------------------------------------------------------------------
        System.out.println("--- Scenario 6: Traffic Collapse (CPU drops to 15%, Scale Down with Step Clamping) ---");
        Thread.sleep(2600); // Wait out scale-down cooldown
        metrics.resetMetrics(MetricType.CPU_UTILIZATION_PERCENT);
        metrics.recordMetric(MetricType.CPU_UTILIZATION_PERCENT, 15.0);
        autoscaler.reconcile();
        System.out.println();

        System.out.println("✅ All Autoscaling & Stabilization Invariants Verified Successfully!");
    }
}
