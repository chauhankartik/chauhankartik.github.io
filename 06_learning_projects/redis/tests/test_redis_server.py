#!/usr/bin/env python3
"""
Automated Protocol & Functional Verification Test Suite for Redis from Scratch.
Connects over raw TCP sockets without third-party library dependencies.
"""

import sys
import time
import socket
import threading
import unittest
import argparse
from typing import Any, List, Optional


class RawRedisClient:
    """Minimal raw TCP client communicating with standard RESP 2 bytes."""
    def __init__(self, host: str = "127.0.0.1", port: int = 6379, timeout: float = 2.0):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.settimeout(timeout)
        self.sock.connect((host, port))
        self.buf = bytearray()

    def send_command(self, *args) -> Any:
        payload = self._encode_command(args)
        self.sock.sendall(payload)
        return self._read_response()

    def send_raw_pipeline(self, commands: List[List[Any]]) -> List[Any]:
        payload = b"".join(self._encode_command(cmd) for cmd in commands)
        self.sock.sendall(payload)
        return [self._read_response() for _ in commands]

    def _encode_command(self, args) -> bytes:
        parts = [f"*{len(args)}\r\n".encode("ascii")]
        for arg in args:
            if isinstance(arg, bytes):
                raw = arg
            else:
                raw = str(arg).encode("utf-8")
            parts.append(f"${len(raw)}\r\n".encode("ascii") + raw + b"\r\n")
        return b"".join(parts)

    def _read_response(self) -> Any:
        while True:
            val, consumed = self._parse_resp(bytes(self.buf))
            if consumed > 0:
                del self.buf[:consumed]
                return val
            chunk = self.sock.recv(4096)
            if not chunk:
                raise ConnectionError("Socket closed prematurely")
            self.buf.extend(chunk)

    def _parse_resp(self, data: bytes) -> tuple[Any, int]:
        if not data:
            return None, 0
        prefix = data[0:1]

        if prefix in (b'+', b'-', b':'):
            idx = data.find(b"\r\n")
            if idx == -1:
                return None, 0
            val_str = data[1:idx].decode("utf-8")
            if prefix == b'+':
                return val_str, idx + 2
            elif prefix == b'-':
                return Exception(val_str), idx + 2
            else:
                return int(val_str), idx + 2

        elif prefix == b'$':
            idx = data.find(b"\r\n")
            if idx == -1:
                return None, 0
            length = int(data[1:idx])
            if length == -1:
                return None, idx + 2
            start = idx + 2
            end = start + length
            if len(data) < end + 2:
                return None, 0
            return data[start:end].decode("utf-8", errors="replace"), end + 2

        elif prefix == b'*':
            idx = data.find(b"\r\n")
            if idx == -1:
                return None, 0
            count = int(data[1:idx])
            if count == -1:
                return None, idx + 2
            offset = idx + 2
            items = []
            for _ in range(count):
                item, consumed = self._parse_resp(data[offset:])
                if consumed == 0:
                    return None, 0
                items.append(item)
                offset += consumed
            return items, offset

        raise ValueError(f"Unknown RESP prefix {prefix}")

    def close(self):
        try:
            self.sock.close()
        except Exception:
            pass


class RedisServerTestSuite(unittest.TestCase):
    HOST = "127.0.0.1"
    PORT = 6379

    def setUp(self):
        self.client = RawRedisClient(self.HOST, self.PORT)
        # Flush DB to clean test state
        self.client.send_command("FLUSHDB")

    def tearDown(self):
        self.client.close()

    def test_01_ping_pong(self):
        res = self.client.send_command("PING")
        self.assertEqual(res, "PONG")

        res_msg = self.client.send_command("PING", "Hello Systems")
        self.assertEqual(res_msg, "Hello Systems")

    def test_02_echo(self):
        res = self.client.send_command("ECHO", "Redis From Scratch")
        self.assertEqual(res, "Redis From Scratch")

    def test_03_set_and_get(self):
        res_set = self.client.send_command("SET", "mykey", "super_secret_value")
        self.assertEqual(res_set, "OK")

        res_get = self.client.send_command("GET", "mykey")
        self.assertEqual(res_get, "super_secret_value")

    def test_04_get_missing_key(self):
        res = self.client.send_command("GET", "does_not_exist_key")
        self.assertIsNone(res)

    def test_05_del_and_exists(self):
        self.client.send_command("SET", "k1", "v1")
        self.client.send_command("SET", "k2", "v2")

        exists_count = self.client.send_command("EXISTS", "k1", "k2", "k3")
        self.assertEqual(exists_count, 2)

        del_count = self.client.send_command("DEL", "k1", "k2", "k3")
        self.assertEqual(del_count, 2)

        exists_after = self.client.send_command("EXISTS", "k1")
        self.assertEqual(exists_after, 0)

    def test_06_incr_and_decr(self):
        val1 = self.client.send_command("INCR", "counter")
        self.assertEqual(val1, 1)

        val2 = self.client.send_command("INCR", "counter")
        self.assertEqual(val2, 2)

        val3 = self.client.send_command("DECR", "counter")
        self.assertEqual(val3, 1)

    def test_07_ttl_and_expire(self):
        self.client.send_command("SET", "ephemeral", "data", "EX", "1")
        ttl = self.client.send_command("TTL", "ephemeral")
        self.assertIn(ttl, [1, 0])

        val = self.client.send_command("GET", "ephemeral")
        self.assertEqual(val, "data")

        # Wait for key to expire
        time.sleep(1.15)

        val_expired = self.client.send_command("GET", "ephemeral")
        self.assertIsNone(val_expired, "Key should have expired and returned None")

        ttl_expired = self.client.send_command("TTL", "ephemeral")
        self.assertEqual(ttl_expired, -2, "TTL on expired key should return -2")

    def test_08_pipelining(self):
        commands = [
            ["SET", "pipe1", "val1"],
            ["SET", "pipe2", "val2"],
            ["GET", "pipe1"],
            ["GET", "pipe2"],
            ["DEL", "pipe1", "pipe2"]
        ]
        responses = self.client.send_raw_pipeline(commands)
        self.assertEqual(responses, ["OK", "OK", "val1", "val2", 2])

    def test_09_keys_pattern(self):
        self.client.send_command("SET", "user:1", "Alice")
        self.client.send_command("SET", "user:2", "Bob")
        self.client.send_command("SET", "item:99", "Hammer")

        keys = self.client.send_command("KEYS", "user:*")
        self.assertEqual(set(keys), {"user:1", "user:2"})

    def test_10_concurrent_clients(self):
        errors = []

        def client_worker(worker_id: int):
            try:
                c = RawRedisClient(self.HOST, self.PORT)
                for i in range(25):
                    k = f"thread_{worker_id}_{i}"
                    c.send_command("SET", k, str(i))
                    val = c.send_command("GET", k)
                    if val != str(i):
                        errors.append(f"Mismatch: expected {i}, got {val}")
                c.close()
            except Exception as e:
                errors.append(str(e))

        threads = [threading.Thread(target=client_worker, args=(i,)) for i in range(5)]
        for t in threads:
            t.start()
        for t in threads:
            t.join()

        self.assertEqual(len(errors), 0, f"Concurrent client errors: {errors}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run Redis Server Test Suite")
    parser.add_argument("--host", default="127.0.0.1", help="Target Redis host")
    parser.add_argument("--port", type=int, default=6379, help="Target Redis port")
    args, unknown = parser.parse_known_args()

    RedisServerTestSuite.HOST = args.host
    RedisServerTestSuite.PORT = args.port

    unittest.main(argv=[sys.argv[0]] + unknown)
