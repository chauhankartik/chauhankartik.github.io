#!/usr/bin/env python3
"""
Very Basic TCP Echo Server.
Step 1 of building Redis: listen on a port, accept a connection, and echo bytes.
"""

import sys
import socket

HOST = "127.0.0.1"
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 6379


def main():
    # 1. Create a TCP/IP streaming socket (AF_INET = IPv4, SOCK_STREAM = TCP)
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # 2. Allow immediate restart on the same address without "Address already in use" errors
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

    # 3. Bind the socket to address and port
    server_socket.bind((HOST, PORT))

    # 4. Listen for incoming connections
    server_socket.listen(5)
    print(f"🚀 TCP Echo Server listening on {HOST}:{PORT}")
    print(f"👉 Connect using: nc {HOST} {PORT}")

    try:
        while True:
            # 5. Wait/block for an incoming client connection
            client_conn, client_addr = server_socket.accept()
            print(f"✅ Client connected from: {client_addr}")

            try:
                # 6. Echo loop: read data and write it right back
                while True:
                    data = client_conn.recv(1024)
                    if not data:
                        # Empty bytes means client closed the connection
                        print(f"👋 Client {client_addr} disconnected")
                        break

                    print(f"📩 Received {len(data)} bytes: {data!r}")

                    # Echo data back to the client
                    client_conn.sendall(data)
            finally:
                client_conn.close()

    except KeyboardInterrupt:
        print("\n🛑 Server stopped.")
    finally:
        server_socket.close()


if __name__ == "__main__":
    main()
