# 2026 Software Engineering Master Study Repository

Welcome to the **2026 Software Engineering Master Study Repository**. This repository is a comprehensive, production-grade technical learning resource designed for Staff Software Engineers, Lead Systems Architects, and Infrastructure Engineers preparing for high-bar technical interviews and principal-level engineering roles.

---

## 1. Master Study Plan & Roadmap

* **[2026 Master Study Plan (12-Week Intensive Curriculum)](STUDY_PLAN_2026.md)**  
  A structured 12-week preparation roadmap organizing all repository domain modules into a phased curriculum covering Data Structures & Algorithms, Java Internals, Advanced SQL, Low-Level System Design (LLD), High-Level System Design (HLD), Distributed Systems Theory, and 16 Infrastructure Tech-Stack deep dives.

---

## 2. Primary Repository Modules

### 1. Data Structures & Algorithms
* **[`01_core_foundations/dsa/`](01_core_foundations/dsa/README.md)** — Comprehensive DSA implementations and masterclasses:
  * **[`Linear-Data-Structures-Masterclass`](01_core_foundations/dsa/Linear-Data-Structures-Masterclass)** & **[`Graph-Algorithms-Masterclass`](01_core_foundations/dsa/Graph-Algorithms-Masterclass)**
  * Arrays, Two Pointers, Sliding Window, Linked Lists, Stacks, Queues, Hashing, Trees, Graphs, Dynamic Programming, and Line Sweep algorithms.
* **[`01_core_foundations/interviewbit/`](01_core_foundations/interviewbit/)** — Real-world interview coding problem practice collections.

### 2. Core Java, Generics & Concurrency Masterclass
* **[`01_core_foundations/java/`](01_core_foundations/java/)** — Deep-dive Java language internals: Collections, Memory Model, Reflection, Generics, and Interfaces.
* **[`01_core_foundations/java/generics/`](01_core_foundations/java/generics/README.md)** — Comprehensive Java Generics Study Suite:
  * Basics & Bounded Types (`01_basics.java`)
  * Wildcards & PECS (`02_wildcards_pecs.java`)
  * Advanced Generic Patterns (`03_advanced.java`)
  * Type Erasure & Synthetic Bridge Methods (`04_type_erasure_bridge_methods.java`)
  * Reflection & Super Type Tokens (`05_reflection_type_tokens.java`)
  * Project Valhalla Primitive Generics Preview (`06_project_valhalla_preview.md`)
* **[`01_core_foundations/java/io/`](01_core_foundations/java/io/README.md)** — Comprehensive Java File I/O, NIO & NIO.2 Study Suite:
  * Classic Byte & Character Streams (`01_classic_io_streams.java`)
  * NIO Channels & Buffers (`02_nio_channels_buffers.java`)
  * Memory-Mapped Files & Zero-Copy (`03_memory_mapped_zero_copy.java`)
  * NIO.2 Path, Files & WatchService (`04_nio2_path_files_watchservice.java`)
  * Concurrent File Locks & Async I/O (`05_file_locking_async_io.java`)
  * Object Serialization & Security (`06_serialization_deep_dive.java`)
* **[`01_core_foundations/java/functional/`](01_core_foundations/java/functional/README.md)** — Comprehensive Java Functional Programming & Stream API Study Suite:
  * Built-in & Custom Functional Interfaces (`01_functional_interfaces_lambdas.java`)
  * Stream API Foundations & Lazy Execution (`02_stream_api_foundations.java`)
  * Advanced Streams, FlatMap & Collectors (`03_advanced_streams_flatmap_collectors.java`)
  * Custom Collector & Parallel Spliterator (`04_custom_collector_spliterator.java`)
  * Monadic Optional Composition (`05_optional_monadic_composition.java`)
  * Functional Design Patterns (`06_functional_design_patterns.java`)
* **[`01_core_foundations/java/interview/`](01_core_foundations/java/interview/README.md)** — Comprehensive Java Interview Tricky Gotchas & Edge Cases Suite:
  * Syntax, Primitives & String Pool Traps (`01_syntax_types_gotchas.java`)
  * OOP, Inheritance & Polymorphic Initialization Traps (`02_oop_inheritance_override_traps.java`)
  * Control Flow, Exceptions & Suppressed Exceptions (`03_control_flow_exceptions_edge_cases.java`)
  * Collections & Concurrency Interview Gotchas (`04_collections_concurrency_gotchas.java`)
  * Memory, Reference Types & ClassLoader Traps (`05_memory_gc_classloader_traps.java`)
  * FAANG Staff Engineer Java Puzzle Suite (`06_staff_interview_puzzle_suite.java`)
* **[`01_core_foundations/java/concurrency/`](01_core_foundations/java/concurrency/README.md)** — Comprehensive Java Concurrency & Multithreading Study Suite:
  * Threads & Monitors (`01_threads_sync.java`)
  * Locks & Executors (`02_locks_executors.java`)
  * CompletableFuture Pipelines (`03_completablefuture.java`)
  * Concurrent Collections (`04_concurrent_collections.java`)
  * Java 21+ Virtual Threads & Loom (`06_virtual_threads_loom.java` / `06_virtual_threads_loom.md`)
  * Lock-Free Atomics & ABA Problem (`07_lock_free_atomics_aba.java`)
  * Advanced Synchronizers (`08_synchronizers_phaser_barrier.java`)
  * ForkJoin Work-Stealing Pool (`09_forkjoin_work_stealing.java`)
  * Reactive Flow API (`10_reactive_streams_flow.java`)

### 3. Database Querying & SQL Masterclass
* **[`01_core_foundations/sql/`](01_core_foundations/sql/README.md)** — Comprehensive SQL query benchmark and reference:
  * **[`00_syntax_cheatsheet.md`](01_core_foundations/sql/00_syntax_cheatsheet.md)**, **[`00_SQL_MindMap.md`](01_core_foundations/sql/00_SQL_MindMap.md)**, **[`00_Recommended_Books_and_Resources.md`](01_core_foundations/sql/00_Recommended_Books_and_Resources.md)**
  * **[`01_easy.sql`](01_core_foundations/sql/01_easy.sql)**, **[`02_medium.sql`](01_core_foundations/sql/02_medium.sql)**, **[`03_hard.sql`](01_core_foundations/sql/03_hard.sql)**, **[`04_google_level.sql`](01_core_foundations/sql/04_google_level.sql)**, **[`05_faang_staff_interview_patterns.sql`](01_core_foundations/sql/05_faang_staff_interview_patterns.sql)**.

### 4. Low-Level System Design (LLD)
* **[`02_system_design/lld/`](02_system_design/lld/README.md)** — Object-Oriented Analysis & Low-Level Design:
  * **[`01_foundations`](02_system_design/lld/01_foundations)** — SOLID principles, OOP abstraction, and encapsulation.
  * **[`02_design_patterns`](02_system_design/lld/02_design_patterns)** — Complete Gang of Four (GoF) Creational, Structural, and Behavioral design patterns.
  * **[`03_system_designs`](02_system_design/lld/03_system_designs)** — Interactive case studies: Elevator System, LRU Cache, Parking Lot, Vending Machine, ATM System, and 9 1-Page PDF Revision Cards.

### 5. High-Level System Design (HLD)
* **[`02_system_design/hld/`](02_system_design/hld/README.md)** — Staff-level High-Level System Design & Architecture:
  * **[`01_system_design_interview_framework.md`](02_system_design/hld/01_system_design_interview_framework.md)** — 4-Step Framework & Back-of-the-Envelope Capacity Estimation.
  * **[`02_distributed_id_generator_snowflake.md`](02_system_design/hld/02_distributed_id_generator_snowflake.md)** — Distributed Unique ID Generator (Twitter Snowflake).
  * **[`03_distributed_rate_limiter.md`](02_system_design/hld/03_distributed_rate_limiter.md)** — Distributed Rate Limiter (Token Bucket / Sliding Window).
  * **[`04_url_shortener_tinyurl.md`](02_system_design/hld/04_url_shortener_tinyurl.md)** — Scalable URL Shortener (TinyURL / KGS).
  * **[`05_distributed_web_crawler.md`](02_system_design/hld/05_distributed_web_crawler.md)** — Distributed Web Crawler (URL Frontier / SimHash).
  * **[`06_chat_messaging_system_whatsapp.md`](02_system_design/hld/06_chat_messaging_system_whatsapp.md)** — Real-Time Chat System (WhatsApp / WebSockets).
  * **[`07_video_streaming_youtube.md`](02_system_design/hld/07_video_streaming_youtube.md)** — Video Streaming Platform (YouTube / ABR HLS).

### 6. Distributed Systems & Data-Intensive Architecture
* **[`03_systems_and_databases/ddia_book_study/`](03_systems_and_databases/ddia_book_study/README.md)** — Comprehensive deep dive based on *Designing Data-Intensive Applications* (DDIA).
* **[`03_systems_and_databases/distributed-systems/`](03_systems_and_databases/distributed-systems/README.md)** — Staff-level distributed systems theory (CAP, Raft/Paxos, Sharding, Replication, 2PC).

### 7. Infrastructure Tech-Stack Deep Dives
* **[`04_infrastructure/tech-stack/`](04_infrastructure/tech-stack/README.md)** — 16 staff-level technology study guides (Redis, Postgres, JDBC, Mongo, Cassandra, ES, S3, Kafka, Gateways, Docker, K8s, Git, Spring Boot, Grafana, Splunk, Hibernate).

### 8. Company-Wise Technical Interview Preparation
* **[`05_company_prep/`](05_company_prep/README.md)** — Targeted company-specific interview playbooks, real past question banks, runnable machine coding solutions, and domain-specific distributed system designs:
  * **[`05_company_prep/company_tiers_salary_and_interview_difficulty.md`](05_company_prep/company_tiers_salary_and_interview_difficulty.md)** — **Salary & Interview Difficulty Tiers (₹30 LPA+ Minimum)**: Segregation of 40+ product companies across HFTs, Big Tech, US Unicorns, Indian Startups, and FinTech GICs.
  * **[`05_company_prep/zepto/`](05_company_prep/zepto/README.md)** — **Zepto SDE-2 & SDE-3 Flagship Guide**: 10-minute dark-store dispatch HLD, flash-sale inventory reservation machine coding, database row-level locking (`SKIP LOCKED`), Kafka ordering, and verified past questions bank.
  * **[`05_company_prep/swiggy_zomato/`](05_company_prep/swiggy_zomato/README.md)** — **Swiggy & Zomato**: Food delivery and quick-commerce (Instamart/Blinkit), real-time dynamic surge pricing, and catalog search engines.
  * **[`05_company_prep/uber_ola/`](05_company_prep/uber_ola/README.md)** — **Uber & Ola**: Planetary-scale mobility networks, Uber H3 hexagonal geospatial dispatch, and GPS telemetry streaming.
  * **[`05_company_prep/amazon_flipkart/`](05_company_prep/amazon_flipkart/README.md)** — **Amazon & Flipkart**: E-commerce scale, high-availability checkout, DynamoDB single-table design, and Amazon Leadership Principles (STAR).
  * **[`05_company_prep/stripe_razorpay/`](05_company_prep/stripe_razorpay/README.md)** — **Stripe & Razorpay**: Global FinTech and payment gateway infrastructure, idempotent charge APIs (`Idempotency-Key`), double-entry bookkeeping ledgers ($\sum \text{Debits} = \sum \text{Credits}$), smart bank routing, transactional outbox webhooks, and 3-way financial reconciliation.
  * **[`05_company_prep/google_meta/`](05_company_prep/google_meta/README.md)** — **Google & Meta**: Advanced algorithmic problem solving, planetary distributed storage, caching hierarchies, and systems resilience.

### 9. Learning Projects (Build Your Own Systems from Scratch)
* **[`06_learning_projects/`](06_learning_projects/README.md)** — First-principles engineering projects building canonical infrastructure from scratch to develop mechanical sympathy:
  * **[`06_learning_projects/redis/`](06_learning_projects/redis/README.md)** — **Redis from Scratch (Flagship Project)**:
    * Single-threaded Reactor pattern, POSIX I/O multiplexing (`epoll`/`select`), and non-blocking event loop (`01_architecture_and_roadmap.md`).
    * Full RESP2/RESP3 wire protocol parser and serializer (`02_resp_protocol_specification.md`).
    * In-memory hashtables with incremental rehashing, Simple Dynamic Strings (SDS), SkipLists, and active/passive TTL key expiration (`03_internals_and_data_structures.md`).
    * Append-Only File (AOF) persistence with background `fork()` Copy-on-Write rewrite, and master-replica replication stream (`04_persistence_and_replication.md`).
    * Ready-to-run event-driven starter servers in **Python** (`starter/python/`) and **C++20** (`starter/cpp/`), verified with official `redis-cli` and an automated test suite (`tests/test_redis_server.py`).
  * **[`03_systems_and_databases/minidb/`](03_systems_and_databases/minidb/)** — **MiniDB Embedded Storage Engine**: Embedded LSM-Tree storage engine written in Rust with WAL crash recovery, MemTable SkipList, binary SSTables, and Bloom filters.

---

## 3. Quick Navigation & Navigation Rules

* All markdown files feature interactive sitemaps, clickable GitHub relative links, Mermaid mind maps, and recommended reading resource lists.
* Start your preparation by following the **[2026 Master Study Plan](STUDY_PLAN_2026.md)**.
