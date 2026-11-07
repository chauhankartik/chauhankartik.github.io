CXX = g++
CXXFLAGS = -std=c++20 -O2 -Wall -Wextra -pthread
TARGET = redis_server_cpp

all: $(TARGET)

$(TARGET): server.cpp
	$(CXX) $(CXXFLAGS) server.cpp -o $(TARGET)

clean:
	rm -f $(TARGET)

.PHONY: all clean
