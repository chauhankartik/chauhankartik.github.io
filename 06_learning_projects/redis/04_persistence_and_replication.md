# 04. Persistence (AOF & RDB) & Master-Replica Replication

Redis combines in-memory execution speed with durable persistence and high availability through two primary subsystems: **Persistence (AOF & RDB)** and **Replication (`PSYNC`)**.

---

## 1. Append-Only File (AOF) Architecture

The **Append-Only File (AOF)** logs every mutating command (`SET`, `DEL`, `EXPIRE`, `HSET`) in standard RESP protocol format to an append-only disk log.

```mermaid
flowchart LR
    Client["Client Command: SET a 1"] --> Server["Execute in Memory"]
    Server --> Response["Send '+OK\\r\\n' to Client"]
    Server --> AOFBuf["Append to aof_buf (User Space)"]
    AOFBuf --> OS["write() to OS Page Cache"]
    OS --> Disk["fsync() to Physical Disk"]
```

### The Three `appendfsync` Policies

| Policy | Calling Mechanism | Data Loss Window | Throughput Impact |
| :--- | :--- | :--- | :--- |
| **`always`** | Calls `fsync()` after *every single command*. | Zero (strictly durable). | Severe (limited by disk rotational/NAND IOPS). |
| **`everysec`** (Default) | Background thread calls `fsync()` once per second. | At most 1–2 seconds of writes. | Near-maximum throughput (~100k ops/sec). |
| **`no`** | Relies on Linux kernel flushing (usually every 30 seconds). | Up to 30 seconds. | Maximum (pure memory-speed writes). |

---

## 2. AOF Rewrite (`BGREWRITEAOF`) via `fork()` and Copy-on-Write

If you run `INCR counter` 1,000,000 times, an unmodified AOF log will store 1,000,000 entries. But the current state is just:
```
SET counter 1000000
```
An **AOF Rewrite** reconstructs the minimal set of commands required to recreate current memory state from scratch.

### The Background Rewrite Workflow

```mermaid
sequenceDiagram
    participant P as Redis Parent Process (Port 6379)
    participant OS as Linux Kernel
    participant C as Forked Child Process
    participant Disk as Disk Storage (temp-rewrite.aof)

    P->>OS: fork()
    Note over OS: OS creates Child Process with Copy-on-Write (COW) memory pages
    OS-->>C: Child process starts with snapshot of memory
    OS-->>P: fork() returns child PID (non-blocking)
    
    par Child writes snapshot
        C->>Disk: Scan db.dict and write minimal RESP commands
    and Parent serves new client traffic
        P->>P: Append new writes to aof_buf AND aof_rewrite_buf
    end

    C->>P: Child completes and exits(0)
    P->>Disk: Flush aof_rewrite_buf to disk
    P->>Disk: Atomic rename(temp-rewrite.aof, appendonly.aof)
```

> [!TIP]
> **Why `fork()` instead of a thread?**  
> In POSIX systems, `fork()` clones the entire virtual address space using hardware **Copy-on-Write (COW)**. The child process sees a frozen point-in-time snapshot of the database without acquiring a single lock or pausing parent execution!

---

## 3. RDB (Redis Database) Snapshots

**RDB** produces a compact, single-file binary serialization of the in-memory dataset:
* Triggered by `BGSAVE` (background `fork()`) or `SAVE` (synchronous, blocks main thread).
* Extremely fast to recover during server boot compared to parsing millions of text AOF commands.
* Uses checksum verification (CRC64) and LZF string compression.

---

## 4. Master-Replica Replication Protocol (`PSYNC`)

Redis supports asynchronous, non-blocking master-replica replication to deliver read scalability and disaster recovery.

```mermaid
sequenceDiagram
    participant R as Replica (Slave)
    participant M as Master

    R->>M: PING
    M-->>R: +PONG\r\n
    R->>M: REPLCONF listening-port 6380
    M-->>R: +OK\r\n
    R->>M: PSYNC ? -1 (Initial Sync Request)
    Note over M: Master generates Replication ID and starts snapshot
    M-->>R: +FULLRESYNC <repl_id> <offset>\r\n
    M-->>R: $[RDB file bytes payload]\r\n
    Note over R: Replica loads RDB into memory
    loop Continuous Replication Stream
        M->>R: Stream mutating commands in RESP format
        R->>M: REPLCONF ACK <processed_offset>
    end
```

### The Replication Backlog (Ring Buffer)
The master maintains a fixed-size in-memory circular ring buffer (**Replication Backlog**, default 1MB).
* If a replica disconnects momentarily (network hiccup), it reconnects with:
  ```
  PSYNC <cached_repl_id> <last_received_offset>
  ```
* If `last_received_offset` is still present in the master's backlog ring buffer, the master sends `+CONTINUE` and streams only the missing diff (**Partial Resynchronization**), avoiding expensive RDB dump and transfer cycles!
