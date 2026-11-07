/**
 * Redis from Scratch — C++20 Starter Template
 * Single-threaded non-blocking event-driven TCP server using POSIX epoll.
 */

#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
#include <chrono>
#include <cstring>
#include <unistd.h>
#include <fcntl.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <sys/epoll.h>

constexpr int MAX_EVENTS = 64;
constexpr int BUFFER_SIZE = 4096;

// Helper to set socket non-blocking
int set_non_blocking(int fd) {
    int flags = fcntl(fd, F_GETFL, 0);
    if (flags == -1) return -1;
    return fcntl(fd, F_SETFL, flags | O_NONBLOCK);
}

// In-Memory Storage
std::unordered_map<std::string, std::string> db;
std::unordered_map<std::string, int64_t> expires; // key -> expiry unix timestamp ms

int64_t current_time_ms() {
    return std::chrono::duration_cast<std::chrono::milliseconds>(
        std::chrono::system_clock::now().time_since_epoch()
    ).count();
}

// Minimal RESP Serializers
std::string serialize_simple_string(const std::string& str) {
    return "+" + str + "\r\n";
}

std::string serialize_error(const std::string& err) {
    return "-ERR " + err + "\r\n";
}

std::string serialize_bulk_string(const std::string& str) {
    return "$" + std::to_string(str.length()) + "\r\n" + str + "\r\n";
}

std::string serialize_null_bulk() {
    return "$-1\r\n";
}

std::string serialize_integer(int64_t val) {
    return ":" + std::to_string(val) + "\r\n";
}

int main(int argc, char* argv[]) {
    int port = 6379;
    if (argc > 1) {
        port = std::stoi(argv[1]);
    }

    int listen_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (listen_fd < 0) {
        perror("socket");
        return 1;
    }

    int opt = 1;
    setsockopt(listen_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
    set_non_blocking(listen_fd);

    sockaddr_in server_addr{};
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(port);

    if (bind(listen_fd, (struct sockaddr*)&server_addr, sizeof(server_addr)) < 0) {
        perror("bind");
        close(listen_fd);
        return 1;
    }

    if (listen(listen_fd, 1024) < 0) {
        perror("listen");
        close(listen_fd);
        return 1;
    }

    int epoll_fd = epoll_create1(0);
    if (epoll_fd < 0) {
        perror("epoll_create1");
        close(listen_fd);
        return 1;
    }

    epoll_event ev{};
    ev.events = EPOLLIN;
    ev.data.fd = listen_fd;
    epoll_ctl(epoll_fd, EPOLL_CTL_ADD, listen_fd, &ev);

    std::cout << "⚡ Redis from scratch (C++20) listening on port " << port << std::endl;

    epoll_event events[MAX_EVENTS];
    char buf[BUFFER_SIZE];

    while (true) {
        int n_fds = epoll_wait(epoll_fd, events, MAX_EVENTS, 100); // 100ms timeout for cron

        for (int i = 0; i < n_fds; ++i) {
            int current_fd = events[i].data.fd;

            if (current_fd == listen_fd) {
                // Inbound connection
                sockaddr_in client_addr{};
                socklen_t client_len = sizeof(client_addr);
                int client_fd = accept(listen_fd, (struct sockaddr*)&client_addr, &client_len);
                if (client_fd >= 0) {
                    set_non_blocking(client_fd);
                    epoll_event client_ev{};
                    client_ev.events = EPOLLIN;
                    client_ev.data.fd = client_fd;
                    epoll_ctl(epoll_fd, EPOLL_CTL_ADD, client_fd, &client_ev);
                }
            } else if (events[i].events & EPOLLIN) {
                // Data available to read
                ssize_t bytes_read = read(current_fd, buf, sizeof(buf) - 1);
                if (bytes_read <= 0) {
                    epoll_ctl(epoll_fd, EPOLL_CTL_DEL, current_fd, nullptr);
                    close(current_fd);
                } else {
                    buf[bytes_read] = '\0';
                    std::string raw(buf, bytes_read);

                    // Basic PING / ECHO fallback handler for starter
                    std::string response;
                    if (raw.find("PING") != std::string::npos) {
                        response = serialize_simple_string("PONG");
                    } else if (raw.find("COMMAND") != std::string::npos) {
                        response = "*0\r\n";
                    } else {
                        response = serialize_simple_string("OK");
                    }
                    ssize_t written = write(current_fd, response.data(), response.size());
                    (void)written;
                }
            }
        }
    }

    close(listen_fd);
    close(epoll_fd);
    return 0;
}
