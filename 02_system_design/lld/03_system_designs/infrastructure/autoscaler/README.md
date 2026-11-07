# Infrastructure Autoscaler System (LLD)

A production-grade, thread-safe **Infrastructure Autoscaler** emulating the **Kubernetes Horizontal Pod Autoscaler (HPA)** and **AWS Auto Scaling Groups (ASG)**.

---

## 📌 Quick Links
* **[00_Theory_and_Design.md](00_Theory_and_Design.md)** — Architectural blueprint, mathematical invariants, hysteresis deadbands, and sequence diagrams.
* **[AutoscalerSystem.java](AutoscalerSystem.java)** — Complete, compile-ready, runnable Java implementation with simulated traffic scenarios.

---

## 🚀 How to Run the Demo

```bash
javac AutoscalerSystem.java
java infrastructure.autoscaler.AutoscalerSystem
```

---

## 📐 Core Mathematical Model

$$\text{DesiredReplicas} = \left\lceil \text{CurrentHealthyReplicas} \times \left( \frac{\text{CurrentMetricValue}}{\text{TargetMetricValue}} \right) \right\rceil$$

* **Hysteresis Deadband:** If $|1 - \text{Ratio}| \le \text{Tolerance}$ (default $\pm 10\%$), no action is taken.
* **Stabilization Window:** Cool-down windows prevent immediate re-triggering.
* **Connection Draining:** Scaling down transitions nodes to `DRAINING` before final termination.
