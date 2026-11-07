# Redis from Scratch — Production-Grade Learning Project

Welcome to the **Redis from Scratch** implementation project. Redis is the industry standard for high-throughput, low-latency, in-memory data structures, caching, messaging, and real-time state synchronization.

By building a functional, production-grade Redis server from scratch, you will master the foundational mechanics powering modern distributed infrastructure: **single-threaded non-blocking I/O multiplexing**, **binary-safe wire protocol parsing**, **incremental hash table rehashing**, **active and passive TTL expiration**, **AOF persistence with background rewrite**, and **master-replica replication**.

---

## 🧠 Architectural Overview

Redis achieves exceptional single-core throughput (100,000+ ops/sec) by eliminating context switching, locks, and thread contention through an **Event-Driven Reactor Pattern**:

```mermaid
flowchart TD
    subgraph Clients["TCP Clients & Official Tools"]
        C1["redis-cli"]
        C2["Client Applications"]
        C3["redis-benchmark"]
    end

    subgraph Server["Redis Server Core (Single-Threaded Event Loop)"]
        IO["I/O Multiplexer (epoll / kqueue / select)"]
        Buffer["Per-Connection Read/Write Buffers"]
        Parser["RESP Protocol Parser / Serializer"]
        Dispatcher["Command Dispatcher & Router"]
        
        subgraph Storage["In-Memory Storage Engine"]
            Dict["Primary Key-Value Dict (ht0 + ht1 Incremental Rehash)"]
            Expires["Expires Dict (Key -> Millisecond Timestamp)"]
            DataTypes["Data Structures: Strings, Lists, Sets, Hashes, ZSets"]
        end
        
        subgraph Background["Maintenance & Background Engines"]
            Cron["Periodic Server Cron (100ms Active TTL Eviction)"]
            AOF["AOF Persistence (Append-Only Log + fsync)"]
            Fork["OS fork() Child Process (AOF Rewrite / RDB Snapshot)"]
        end
    end

    Clients <-->|Raw TCP Sockets (Port 6379)| IO
    IO --> Buffer
    Buffer --> Parser
    Parser --> Dispatcher
    Dispatcher <--> Storage
    Cron -.-> Storage
    Dispatcher -.-> AOF
    AOF -.-> Fork
```

---

## 🎯 10-Milestone Implementation Roadmap

| Milestone | Stage | Core Focus | Supported Commands / Features |
| :---: | :--- | :--- | :--- |
| **01** | **TCP & Event Loop** | Non-blocking sockets, I/O multiplexing (`epoll`/`select`/NIO) | Accept connections, manage client lifecycles |
| **02** | **RESP Wire Protocol** | Serialization & streaming deserialization of RESP2 frames | Simple Strings, Errors, Integers, Bulk Strings, Arrays, Nil |
| **03** | **Core String K/V** | In-memory key-value dictionary, command routing | `PING`, `ECHO`, `SET`, `GET`, `DEL`, `EXISTS`, `INCR`, `DECR`, `MGET`, `MSET` |
| **04** | **Key Expiration & TTL** | Dual dictionary (`db.dict` + `db.expires`), active & passive eviction | `EXPIRE`, `PEXPIRE`, `TTL`, `PTTL`, `PERSIST`, periodic cron timer |
| **05** | **Rich Data Types** | Linked Lists, Sets, Hashes, and Sorted Sets (SkipList) | `LPUSH`, `RPOP`, `LRANGE`, `HSET`, `HGET`, `SADD`, `SMEMBERS`, `ZADD`, `ZRANGE` |
| **06** | **AOF Persistence** | Append-only file journaling, command reconstruction | Command logging on write, server recovery on boot |
| **07** | **AOF Rewrite & RDB** | Copy-on-Write background serialization via `fork()` | `BGREWRITEAOF`, `BGSAVE`, compact file generation |
| **08** | **Memory Eviction** | Maxmemory limits, LRU & LFU approximate sampling | `volatile-lru`, `allkeys-lru`, `noeviction` policies |
| **09** | **Transactions & Atomic State** | Command queueing, isolation, and optimistic locking | `MULTI`, `EXEC`, `DISCARD`, `WATCH` |
| **10** | **Replication Stream** | Master-replica synchronization and offset tracking | `REPLCONF`, `PSYNC`, replication backlog buffer |

---

## 📚 Deep-Dive Project Documentation

1. **[Architecture, Event Loop & Roadmap](01_architecture_and_roadmap.md)**  
   Detailed breakdown of the Reactor pattern, non-blocking POSIX socket APIs, buffer handling, and command execution pipelines.
2. **[RESP Protocol Specification & Wire Framing](02_resp_protocol_specification.md)**  
   Full specification for RESP 2 & RESP 3, framing rules, type prefixes (`+`, `-`, `:`, `$`, `*`), streaming edge cases, and pipelining.
3. **[Internals & Data Structures](03_internals_and_data_structures.md)**  
   Step-by-step algorithms for Simple Dynamic Strings (SDS), Dict incremental 2-table rehashing, SkipList ranking, and active TTL sampling.
4. **[Persistence & Master-Replica Replication](04_persistence_and_replication.md)**  
   Append-Only File (AOF) format, `fsync` strategies, child process `fork()` Copy-on-Write rewrite mechanics, and `PSYNC` protocol.

---

## 🛠️ Starter Codebases & Test Suite

The project includes ready-to-run starter templates and an automated protocol verification test suite:

* **[`starter/python/`](starter/python/)** — Complete, working, single-threaded non-blocking event-driven Redis server built with Python's `selectors` (`epoll`/`kqueue`/`select`) and a production-grade streaming RESP parser.
* **[`starter/cpp/`](starter/cpp/)** — High-performance modern C++20 starter template with non-blocking socket loop and RESP parsing skeleton.
* **[`tests/test_redis_server.py`](tests/test_redis_server.py)** — Automated test harness verifying RESP wire compliance, basic commands, TTL expiration, pipelining, and multi-client concurrency.

### Running the Python Starter Server

```bash
# From the redis project root:
cd starter/python
python3 redis_server.py --port 6379
```

### Testing with Official `redis-cli`

In a separate terminal:
```bash
$ redis-cli -p 6379
127.0.0.1:6379> PING
PONG
127.0.0.1:6379> SET user:100 "Kartik"
OK
127.0.0.1:6379> GET user:100
"Kartik"
127.0.0.1:6379> EXPIRE user:100 10
(integer) 1
127.0.0.1:6379> TTL user:100
(integer) 9
```

### Running the Automated Test Suite

```bash
cd tests
python3 test_redis_server.py --port 6379
```

---

## 🔗 Cross-Referenced Theory Guides

To understand the production Redis internals and C source code (`ae.c`, `server.c`, `t_string.c`, `t_zset.c`), cross-reference:

* **[Redis Tech-Stack Deep Dive](../../04_infrastructure/tech-stack/redis/README.md)**
* **[Redis C Data Structures & Internals](../../04_infrastructure/tech-stack/redis/ch01_data_structures_and_internals.md)**
* **[Redis Event Loop & Reactor Architecture](../../04_infrastructure/tech-stack/redis/ch02_event_loop_and_architecture.md)**
* **[Redis Memory Management & Eviction](../../04_infrastructure/tech-stack/redis/ch03_memory_management_and_eviction.md)**
* **[Redis Persistence (RDB & AOF)](../../04_infrastructure/tech-stack/redis/ch04_persistence_rdb_and_aof.md)**
* **[Redis High Availability & Replication](../../04_infrastructure/tech-stack/redis/ch05_replication_and_sentinel.md)**
