# Stripe & Razorpay — Past Technical Interview Questions Bank

This question bank aggregates **40+ verified past interview questions** from engineering loops at **Stripe (L2/L3 Software Engineer & Staff)** and **Razorpay (SDE-2, SDE-3, Lead Architect)** across India, the US, and remote hubs.

---

## 💻 1. Practical Coding & Algorithmic Problem Solving

Stripe and Razorpay rarely ask abstract competitive programming puzzles (like obscure segment trees). Instead, they emphasize **clean, readable, production-grade code** handling text parsing, financial validation, rate limiting, and graph traversal.

### Category A: Financial Algorithms & Validation
1. **Luhn Algorithm Credit Card Number Validator:**
   * Implement a binary Luhn algorithm to validate Visa, Mastercard, and Amex credit card numbers.
   * Calculate check digits and identify the issuing network from the Bank Identification Number (BIN) prefix.
2. **Multi-Currency FX Exchange & Arbitrage Detection:**
   * Given a directed graph of currency conversion rates (e.g. `USD -> EUR: 0.92`, `EUR -> GBP: 0.85`), find the optimal conversion rate between any two currencies.
   * *Algorithm:* Modified Bellman-Ford or Floyd-Warshall with negative log weights ($-\log(\text{rate})$) to detect foreign exchange arbitrage cycles.
3. **Parse Stripe / Razorpay Webhook Signatures:**
   * Write an HMAC-SHA256 verification function taking raw body bytes, an epoch timestamp, and a header `t=1492774577,v1=5257...`.
   * Defend against replay attacks by enforcing a tolerance window ($|t_{\text{current}} - t_{\text{header}}| \le 300\text{ seconds}$).

### Category B: High-Frequency LeetCode Problem Mappings
* **[LeetCode 359: Logger Rate Limiter](https://leetcode.com/problems/logger-rate-limiter/)** *(Easy/Medium — Foundational rate limiting and sliding window)*
* **[LeetCode 139: Word Break](https://leetcode.com/problems/word-break/)** *(Medium — Tokenizing payment routing strings)*
* **[LeetCode 224: Basic Calculator](https://leetcode.com/problems/basic-calculator/)** *(Hard — Parsing custom pricing and fee formulas)*
* **[LeetCode 200: Number of Islands](https://leetcode.com/problems/number-of-islands/)** *(Medium — Graph connectivity in fraud ring detection)*
* **[LeetCode 146: LRU Cache](https://leetcode.com/problems/lru-cache/)** *(Medium — Fast in-memory token and rate-limit cache)*
* **[LeetCode 23: Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)** *(Hard — Merging multi-bank settlement event streams)*

---

## 🏗️ 2. Machine Coding & Low-Level Design (LLD)

You are typically given 90 to 120 minutes with your favorite IDE. Expect to write unit tests and defend thread safety.

### 1. In-Memory Key-Value Store with Transactions & TTL (The Classic Stripe Problem)
* **Prompt:** Build an in-memory key-value store supporting:
  - `SET(key, value)`, `GET(key)`, `DELETE(key)`
  - `EXPIRE(key, ttl_seconds)`
  - `BEGIN()`, `COMMIT()`, `ROLLBACK()` with nested transaction support.
* **Key Invariants:** Nested transactions must isolate uncommitted mutations from the parent scope until `COMMIT()`.

### 2. Idempotent Payment & Multi-Currency Ledger Engine
* **Prompt:** Build a payment service that prevents duplicate payments on network retries while updating double-entry ledger accounts.
* *See full runnable solution:* [`01_machine_coding_idempotent_payment_and_ledger.md`](01_machine_coding_idempotent_payment_and_ledger.md)

### 3. Distributed In-Memory Rate Limiter with Sliding Window Counter
* **Prompt:** Implement an API rate limiter supporting per-merchant tier quotas (e.g. Tier 1: 100 RPS, Tier 2: 1000 RPS).
* **Key Invariants:** Must handle sub-millisecond sliding windows and lock-free thread contention.

### 4. Smart Payment Routing Rule Engine (Razorpay Favorite)
* **Prompt:** Design a dynamic routing engine that evaluates rules for incoming payment requests:
  - If `method == "UPI"` and `amount < 2000`, route to `NPCI_DIRECT`.
  - If `card_network == "VISA"` and `bank == "HDFC"`, route to `HDFC_GATEWAY_V2`.
  - Support fallback cascades if primary gateway fails.
* **Design Pattern:** **Chain of Responsibility** + **Strategy Pattern**.

### 5. Reliable Webhook Dispatcher
* **Prompt:** Implement a webhook delivery system that receives events, queues them, signs them with HMAC-SHA256, and dispatches them with exponential backoff and max retry limits.

---

## 🏛️ 3. High-Level Distributed System Design (HLD)

### 1. Design a Global Payment Gateway (Stripe Core / Razorpay PG)
* **Scale:** 50,000 RPS peak, 99.999% availability, PCI-DSS Level 1 compliance.
* **Core Topics:** API Gateway, Idempotency layer, PCI tokenization vault, Bank gateway adapters, Two-Phase Commit vs Saga, and Webhook notification.
* *See full architecture blueprint:* [`02_hld_payment_gateway_and_ledger.md`](02_hld_payment_gateway_and_ledger.md)

### 2. Design a Distributed Double-Entry Ledger (Stripe Ledger)
* **Prompt:** Design a financial ledger storing all balance movements across 100M+ accounts.
* **Core Topics:** Immutable append-only log, linearizable consistency, sharding by `merchant_id` or `ledger_id`, snapshotting daily balances, zero floating-point drift, and audit trail generation.

### 3. Automated 3-Way Financial Reconciliation Pipeline
* **Prompt:** Design the end-of-day batch pipeline that reconciles internal ledger records against acquiring bank settlement files (MT940/CSV) and Visa/Mastercard clearing logs.
* **Core Topics:** Handling breaks (timing differences, fee mismatches, currency rounding), distributed joins in Apache Spark, and automated dispute generation.

### 4. Design a Subscription & Recurring Billing Platform (Stripe Billing)
* **Prompt:** Design an invoicing and subscription management service that bills millions of recurring customers monthly.
* **Core Topics:** Proration calculations on plan upgrades, dunning management (retrying failed credit cards on specific days), calendar vs anniversary billing, and multi-region tax calculation.

### 5. Real-Time Payment Fraud Detection Engine (Stripe Radar)
* **Prompt:** Evaluate incoming payments for fraud risk within 50ms before routing to the card network.
* **Core Topics:** Feature store (IP velocity, card fingerprint count, country mismatch), ML model inference latency budgets, rule overrides, and 3D-Secure step-up authentication.

---

## 🛡️ 4. Staff-Level Bar Raiser & Outage Scenarios

Stripe and Razorpay place enormous weight on how senior and staff engineers think through catastrophic failures:

### Scenario 1: The "Ghost Capture" Outage
> **Interviewer Scenario:**  
> *"A merchant initiated a \$500 payment. Your gateway sent the charge request to the acquiring bank, but your connection to the bank timed out after 30 seconds. The customer's mobile app shows a network failure screen, but the customer received an SMS from their bank stating that \$500 was deducted. How do you resolve this without customer support intervention?"*

* **Staff Response Invariants:**
  1. **Deterministic Status Polling:** Do NOT immediately assume failure. Queue a background reconciliation task to query the bank's transaction status API using the merchant order reference.
  2. **Auto-Reversal / Void:** If the charge status at the bank is `AUTHORIZED` but the internal gateway marked the transaction `FAILED`, the gateway must automatically dispatch an asynchronous `REVERSAL` / `VOID` instruction to the bank to release the customer's funds.
  3. **Merchant Webhook Synchronization:** If the bank cannot reverse the charge, transition the internal state to `CAPTURED`, credit the ledger, and dispatch a `payment.succeeded` webhook to the merchant so the customer receives their order.

### Scenario 2: Two Data Centers, One Account Balance
> **Interviewer Scenario:**  
> *"To achieve multi-region active-active resilience, your service runs in AWS us-east-1 (N. Virginia) and AWS us-west-2 (Oregon). A customer attempts to withdraw \$100 simultaneously from both regions with an account balance of exactly \$100. How do you prevent a double-spend without paying a 70ms cross-country latency penalty on every read?"*

* **Staff Response Invariants:**
  1. **Single-Leader Partitioning:** Partition accounts by `hash(account_id) % N` so that a given account's ledger partition is authoritatively owned by a single primary region.
  2. **Two-Phase Commit (2PC) / Distributed Consensus:** Use a globally distributed linearizable database (like CockroachDB or Google Spanner) with Raft/Paxos consensus groups scoped per account range.
  3. **Optimistic Locking with Versioning:** Store a monotonic `version` counter on account metadata. Writes require `UPDATE accounts SET balance = balance - 100, version = version + 1 WHERE id = ? AND version = ? AND balance >= 100`.
