# Redis from Scratch — Starter Codebases

This directory contains starter templates and working implementations in **Python** and **Modern C++20** to bootstrap your Redis from scratch project.

---

## 📁 Starter Tracks

### 1. Python Track (`python/`)
* **`resp.py`**: Production-grade serializer and streaming non-blocking RESP parser.
* **`redis_server.py`**: A fully functional single-threaded event-driven Redis server powered by Python's `selectors` module (`epoll` on Linux).
  * Implements `PING`, `ECHO`, `SET` (with `EX`/`PX`), `GET`, `DEL`, `EXISTS`, `INCR`, `DECR`, `EXPIRE`, `PEXPIRE`, `TTL`, `PTTL`, `PERSIST`, `KEYS`, and `FLUSHDB`.
  * Implements **passive expiration** on read + **active randomized sampling expiration** in `server_cron` (10Hz).

#### Running the Python Server:
```bash
cd python
python3 redis_server.py --port 6379
```

---

### 2. Modern C++20 Track (`cpp/`)
* **`server.cpp`**: Single-threaded event loop utilizing Linux kernel `epoll`, non-blocking POSIX socket configuration, and basic RESP serialization.
* **`Makefile`**: Standard compilation script targeting `-std=c++20 -O2`.

#### Building & Running C++:
```bash
cd cpp
make
./redis_server_cpp 6379
```

---

## 🧪 Testing Your Implementation

Run the automated test suite against your running server:

```bash
cd ../tests
python3 test_redis_server.py --port 6379
```

Or connect with the official Redis CLI:
```bash
redis-cli -p 6379
```
