#!/usr/bin/env python3
"""
Single-Threaded Non-Blocking Event-Driven Redis Server from Scratch.
Implements the Reactor pattern using POSIX I/O multiplexing (selectors/epoll).
"""

import sys
import os
import time
import socket
import selectors
import fnmatch
import random
import argparse
from typing import Dict, Optional, Tuple, List, Any

# Ensure local resp module is importable
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from resp import (
    serialize_simple_string,
    serialize_error,
    serialize_integer,
    serialize_bulk_string,
    serialize_array,
    serialize,
    parse_resp_stream,
    RespError
)


class ClientConnection:
    """Tracks state and buffers for an active TCP client socket."""
    def __init__(self, sock: socket.socket, addr: Tuple[str, int]):
        self.sock = sock
        self.addr = addr
        self.read_buf = bytearray()
        self.write_buf = bytearray()

    def fileno(self) -> int:
        return self.sock.fileno()


class RedisServer:
    """Production-grade single-threaded Redis server core."""
    def __init__(self, host: str = "127.0.0.1", port: int = 6379):
        self.host = host
        self.port = port
        self.selector = selectors.DefaultSelector()
        self.server_sock: Optional[socket.socket] = None
        self.clients: Dict[int, ClientConnection] = {}

        # In-Memory Storage Engine
        self.db: Dict[bytes, bytes] = {}
        self.expires: Dict[bytes, int] = {}  # key -> expiry timestamp in milliseconds

        # Metrics
        self.total_commands_processed = 0
        self.start_time = time.time()
        self.last_cron_time = time.time()

    def start(self):
        """Initializes TCP server socket and enters event loop."""
        self.server_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.server_sock.setblocking(False)
        self.server_sock.bind((self.host, self.port))
        self.server_sock.listen(1024)

        self.selector.register(self.server_sock, selectors.EVENT_READ, data=None)
        print(f"⚡ Redis from scratch running at {self.host}:{self.port}")
        print("Ready to accept connections (Ctrl+C to stop)...")

        try:
            while True:
                # Poll I/O multiplexer with a 100ms timeout for time events
                events = self.selector.select(timeout=0.1)
                for key, mask in events:
                    if key.data is None:
                        # Event on listening server socket
                        self._accept_client()
                    else:
                        # Event on client socket
                        client: ClientConnection = key.data
                        if mask & selectors.EVENT_READ:
                            self._handle_read(client)
                        if mask & selectors.EVENT_WRITE:
                            self._handle_write(client)

                # Periodic Server Cron (Time Events at 10Hz)
                now = time.time()
                if now - self.last_cron_time >= 0.1:
                    self._server_cron()
                    self.last_cron_time = now

        except KeyboardInterrupt:
            print("\nShutting down Redis server...")
        finally:
            self._cleanup()

    def _accept_client(self):
        """Accepts a new inbound TCP connection and registers with selector."""
        try:
            client_sock, addr = self.server_sock.accept()
            client_sock.setblocking(False)
            client = ClientConnection(client_sock, addr)
            self.clients[client.fileno()] = client
            self.selector.register(client_sock, selectors.EVENT_READ, data=client)
        except BlockingIOError:
            pass

    def _handle_read(self, client: ClientConnection):
        """Reads incoming bytes and dispatches parsed RESP commands."""
        try:
            chunk = client.sock.recv(4096)
        except (ConnectionResetError, BrokenPipeError):
            self._close_client(client)
            return

        if not chunk:
            # Client closed connection cleanly
            self._close_client(client)
            return

        client.read_buf.extend(chunk)

        # Parse and execute all complete RESP commands in pipeline
        while True:
            try:
                command, consumed = parse_resp_stream(bytes(client.read_buf))
            except RespError as err:
                client.write_buf.extend(serialize_error(str(err)))
                client.read_buf.clear()
                self._update_client_interest(client)
                break

            if consumed == 0:
                # Incomplete frame, wait for more data from socket
                break

            # Consume bytes from buffer
            del client.read_buf[:consumed]

            # Execute command
            response_bytes = self._execute_command(command)
            client.write_buf.extend(response_bytes)
            self.total_commands_processed += 1

        self._update_client_interest(client)

    def _handle_write(self, client: ClientConnection):
        """Flushes outbound response buffer to client socket."""
        if not client.write_buf:
            self._update_client_interest(client)
            return

        try:
            sent = client.sock.send(client.write_buf)
            del client.write_buf[:sent]
        except (BlockingIOError, InterruptedError):
            pass
        except (ConnectionResetError, BrokenPipeError):
            self._close_client(client)
            return

        self._update_client_interest(client)

    def _update_client_interest(self, client: ClientConnection):
        """Updates selector masks: listens for EVENT_WRITE if buffer non-empty."""
        try:
            mask = selectors.EVENT_READ
            if len(client.write_buf) > 0:
                mask |= selectors.EVENT_WRITE
            self.selector.modify(client.sock, mask, data=client)
        except KeyError:
            pass

    def _close_client(self, client: ClientConnection):
        """Unregisters and closes a client socket."""
        fileno = client.fileno()
        if fileno in self.clients:
            del self.clients[fileno]
        try:
            self.selector.unregister(client.sock)
            client.sock.close()
        except Exception:
            pass

    def _cleanup(self):
        """Cleans up all sockets on server shutdown."""
        for client in list(self.clients.values()):
            self._close_client(client)
        if self.server_sock:
            try:
                self.selector.unregister(self.server_sock)
                self.server_sock.close()
            except Exception:
                pass
        self.selector.close()

    # =========================================================================
    # Storage Engine & Key Expiration
    # =========================================================================

    def _current_time_ms(self) -> int:
        return int(time.time() * 1000)

    def _is_expired(self, key: bytes) -> bool:
        """Returns True and removes key if expired (Passive Eviction)."""
        if key in self.expires:
            if self._current_time_ms() >= self.expires[key]:
                self.db.pop(key, None)
                self.expires.pop(key, None)
                return True
        return False

    def _get_key(self, key: bytes) -> Optional[bytes]:
        """Passive eviction key lookup."""
        if self._is_expired(key):
            return None
        return self.db.get(key)

    def _server_cron(self):
        """
        Active Key Expiration (10Hz).
        Probabilistic sampling: tests up to 20 keys with expiration.
        If > 25% expired, repeats until time limit (25ms).
        """
        if not self.expires:
            return

        start_ms = self._current_time_ms()
        while True:
            keys_to_sample = list(self.expires.keys())
            sample_size = min(20, len(keys_to_sample))
            sampled = random.sample(keys_to_sample, sample_size)
            expired_count = 0
            now = self._current_time_ms()

            for k in sampled:
                if now >= self.expires.get(k, float('inf')):
                    self.db.pop(k, None)
                    self.expires.pop(k, None)
                    expired_count += 1

            # If fewer than 25% were expired, or elapsed time > 25ms, yield
            if expired_count <= (sample_size * 0.25) or (self._current_time_ms() - start_ms > 25):
                break

    # =========================================================================
    # Command Dispatcher & Handlers
    # =========================================================================

    def _execute_command(self, cmd_parts: Any) -> bytes:
        """Routes parsed command parts to handler."""
        if not cmd_parts or not isinstance(cmd_parts, list):
            return serialize_error("invalid command format")

        cmd_name = cmd_parts[0]
        if isinstance(cmd_name, bytes):
            cmd_name = cmd_name.decode("utf-8", errors="replace").upper()
        else:
            cmd_name = str(cmd_name).upper()

        args = cmd_parts[1:]

        # Map to handler
        handler = getattr(self, f"cmd_{cmd_name.lower()}", None)
        if not handler:
            return serialize_error(f"unknown command '{cmd_name}'")

        try:
            return handler(args)
        except Exception as e:
            return serialize_error(str(e))

    def cmd_ping(self, args: List[Any]) -> bytes:
        if not args:
            return serialize_simple_string("PONG")
        msg = args[0]
        return serialize_bulk_string(msg)

    def cmd_echo(self, args: List[Any]) -> bytes:
        if not args:
            return serialize_error("wrong number of arguments for 'echo' command")
        return serialize_bulk_string(args[0])

    def cmd_set(self, args: List[Any]) -> bytes:
        if len(args) < 2:
            return serialize_error("wrong number of arguments for 'set' command")

        key = args[0] if isinstance(args[0], bytes) else str(args[0]).encode("utf-8")
        val = args[1] if isinstance(args[1], bytes) else str(args[1]).encode("utf-8")

        ttl_ms = None
        i = 2
        while i < len(args):
            opt = args[i].decode("utf-8", errors="replace").upper() if isinstance(args[i], bytes) else str(args[i]).upper()
            if opt == "EX" and i + 1 < len(args):
                seconds = int(args[i + 1])
                ttl_ms = seconds * 1000
                i += 2
            elif opt == "PX" and i + 1 < len(args):
                ttl_ms = int(args[i + 1])
                i += 2
            else:
                return serialize_error(f"syntax error near '{opt}'")

        self.db[key] = val
        if ttl_ms is not None:
            self.expires[key] = self._current_time_ms() + ttl_ms
        else:
            self.expires.pop(key, None)

        return serialize_simple_string("OK")

    def cmd_get(self, args: List[Any]) -> bytes:
        if len(args) != 1:
            return serialize_error("wrong number of arguments for 'get' command")

        key = args[0] if isinstance(args[0], bytes) else str(args[0]).encode("utf-8")
        val = self._get_key(key)
        if val is None:
            return serialize_bulk_string(None)
        return serialize_bulk_string(val)

    def cmd_del(self, args: List[Any]) -> bytes:
        if not args:
            return serialize_error("wrong number of arguments for 'del' command")

        deleted = 0
        for raw_k in args:
            k = raw_k if isinstance(raw_k, bytes) else str(raw_k).encode("utf-8")
            if not self._is_expired(k) and k in self.db:
                self.db.pop(k, None)
                self.expires.pop(k, None)
                deleted += 1
            else:
                self.expires.pop(k, None)
        return serialize_integer(deleted)

    def cmd_exists(self, args: List[Any]) -> bytes:
        if not args:
            return serialize_error("wrong number of arguments for 'exists' command")

        count = 0
        for raw_k in args:
            k = raw_k if isinstance(raw_k, bytes) else str(raw_k).encode("utf-8")
            if not self._is_expired(k) and k in self.db:
                count += 1
        return serialize_integer(count)

    def cmd_incr(self, args: List[Any]) -> bytes:
        return self._incr_by(args, 1)

    def cmd_decr(self, args: List[Any]) -> bytes:
        return self._incr_by(args, -1)

    def _incr_by(self, args: List[Any], delta: int) -> bytes:
        if len(args) != 1:
            return serialize_error("wrong number of arguments for increment command")

        key = args[0] if isinstance(args[0], bytes) else str(args[0]).encode("utf-8")
        val = self._get_key(key)
        if val is None:
            new_val = delta
        else:
            try:
                new_val = int(val.decode("utf-8")) + delta
            except ValueError:
                return serialize_error("value is not an integer or out of range")

        self.db[key] = str(new_val).encode("utf-8")
        return serialize_integer(new_val)

    def cmd_expire(self, args: List[Any]) -> bytes:
        if len(args) != 2:
            return serialize_error("wrong number of arguments for 'expire' command")
        key = args[0] if isinstance(args[0], bytes) else str(args[0]).encode("utf-8")
        try:
            seconds = int(args[1])
        except ValueError:
            return serialize_error("value is not an integer or out of range")

        if self._is_expired(key) or key not in self.db:
            return serialize_integer(0)

        self.expires[key] = self._current_time_ms() + (seconds * 1000)
        return serialize_integer(1)

    def cmd_pexpire(self, args: List[Any]) -> bytes:
        if len(args) != 2:
            return serialize_error("wrong number of arguments for 'pexpire' command")
        key = args[0] if isinstance(args[0], bytes) else str(args[0]).encode("utf-8")
        try:
            ms = int(args[1])
        except ValueError:
            return serialize_error("value is not an integer or out of range")

        if self._is_expired(key) or key not in self.db:
            return serialize_integer(0)

        self.expires[key] = self._current_time_ms() + ms
        return serialize_integer(1)

    def cmd_ttl(self, args: List[Any]) -> bytes:
        if len(args) != 1:
            return serialize_error("wrong number of arguments for 'ttl' command")
        key = args[0] if isinstance(args[0], bytes) else str(args[0]).encode("utf-8")

        if self._is_expired(key) or key not in self.db:
            return serialize_integer(-2)  # Key does not exist

        if key not in self.expires:
            return serialize_integer(-1)  # Key exists but has no associated expire

        remaining_ms = self.expires[key] - self._current_time_ms()
        if remaining_ms <= 0:
            self._is_expired(key)
            return serialize_integer(-2)

        return serialize_integer(remaining_ms // 1000)

    def cmd_pttl(self, args: List[Any]) -> bytes:
        if len(args) != 1:
            return serialize_error("wrong number of arguments for 'pttl' command")
        key = args[0] if isinstance(args[0], bytes) else str(args[0]).encode("utf-8")

        if self._is_expired(key) or key not in self.db:
            return serialize_integer(-2)

        if key not in self.expires:
            return serialize_integer(-1)

        remaining_ms = self.expires[key] - self._current_time_ms()
        if remaining_ms <= 0:
            self._is_expired(key)
            return serialize_integer(-2)

        return serialize_integer(remaining_ms)

    def cmd_persist(self, args: List[Any]) -> bytes:
        if len(args) != 1:
            return serialize_error("wrong number of arguments for 'persist' command")
        key = args[0] if isinstance(args[0], bytes) else str(args[0]).encode("utf-8")

        if self._is_expired(key) or key not in self.db:
            return serialize_integer(0)

        if key in self.expires:
            self.expires.pop(key, None)
            return serialize_integer(1)
        return serialize_integer(0)

    def cmd_keys(self, args: List[Any]) -> bytes:
        if len(args) != 1:
            return serialize_error("wrong number of arguments for 'keys' command")
        pattern = args[0].decode("utf-8", errors="replace") if isinstance(args[0], bytes) else str(args[0])

        matching = []
        for k in list(self.db.keys()):
            if not self._is_expired(k):
                k_str = k.decode("utf-8", errors="replace")
                if fnmatch.fnmatch(k_str, pattern):
                    matching.append(k)

        return serialize_array(matching)

    def cmd_flushdb(self, args: List[Any]) -> bytes:
        self.db.clear()
        self.expires.clear()
        return serialize_simple_string("OK")

    def cmd_info(self, args: List[Any]) -> bytes:
        uptime = int(time.time() - self.start_time)
        info = (
            f"# Server\r\n"
            f"redis_version:7.0.0-scratch\r\n"
            f"os:Linux\r\n"
            f"uptime_in_seconds:{uptime}\r\n"
            f"# Clients\r\n"
            f"connected_clients:{len(self.clients)}\r\n"
            f"# Stats\r\n"
            f"total_commands_processed:{self.total_commands_processed}\r\n"
            f"# Keyspace\r\n"
            f"db0:keys={len(self.db)},expires={len(self.expires)}\r\n"
        )
        return serialize_bulk_string(info)

    def cmd_command(self, args: List[Any]) -> bytes:
        # Needed for redis-cli compatibility
        return serialize_array([])


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Redis from Scratch Server")
    parser.add_argument("--host", default="127.0.0.1", help="Host address to bind")
    parser.add_argument("--port", type=int, default=6379, help="Port to listen on (default 6379)")
    cli_args = parser.parse_args()

    server = RedisServer(host=cli_args.host, port=cli_args.port)
    server.start()
