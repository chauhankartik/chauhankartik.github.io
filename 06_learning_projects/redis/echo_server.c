/**
 * Very Basic TCP Echo Server in C (POSIX).
 * Step 1 of building Redis: socket(), bind(), listen(), accept(), read(), write().
 *
 * Compile:
 *   gcc -O2 echo_server.c -o echo_server
 * Run:
 *   ./echo_server
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

#define PORT 6379
#define BUFFER_SIZE 1024

int main(int argc, char *argv[]) {
    int port = (argc > 1) ? atoi(argv[1]) : PORT;
    int server_fd, client_fd;
    struct sockaddr_in server_addr, client_addr;
    socklen_t client_len = sizeof(client_addr);
    char buffer[BUFFER_SIZE];

    // 1. Create TCP socket
    server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd < 0) {
        perror("socket failed");
        exit(EXIT_FAILURE);
    }

    // 2. Set SO_REUSEADDR to avoid "Address already in use" on fast restart
    int opt = 1;
    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    // 3. Bind address
    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY; // 0.0.0.0
    server_addr.sin_port = htons(port);

    if (bind(server_fd, (struct sockaddr*)&server_addr, sizeof(server_addr)) < 0) {
        perror("bind failed");
        close(server_fd);
        exit(EXIT_FAILURE);
    }

    // 4. Listen for incoming connections
    if (listen(server_fd, 5) < 0) {
        perror("listen failed");
        close(server_fd);
        exit(EXIT_FAILURE);
    }

    printf("🚀 TCP Echo Server (C) listening on port %d\n", port);
    printf("👉 Connect using: nc localhost %d\n", port);

    while (1) {
        // 5. Accept connection
        client_fd = accept(server_fd, (struct sockaddr*)&client_addr, &client_len);
        if (client_fd < 0) {
            perror("accept failed");
            continue;
        }

        char client_ip[INET_ADDRSTRLEN];
        inet_ntop(AF_INET, &client_addr.sin_addr, client_ip, sizeof(client_ip));
        printf("✅ Client connected: %s:%d\n", client_ip, ntohs(client_addr.sin_port));

        // 6. Echo loop
        ssize_t bytes_read;
        while ((bytes_read = read(client_fd, buffer, sizeof(buffer))) > 0) {
            // Write exact bytes back to client
            ssize_t written = write(client_fd, buffer, (size_t)bytes_read);
            (void)written;
        }

        printf("👋 Client disconnected.\n");
        close(client_fd);
    }

    close(server_fd);
    return 0;
}
