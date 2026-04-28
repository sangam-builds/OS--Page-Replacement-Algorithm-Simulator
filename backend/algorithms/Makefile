CC = gcc
CFLAGS = -Wall -Wextra
SHARED_CFLAGS = -fPIC -shared
TARGET = build/algorithms
CLI_TARGET = build/algorithms_cli

SOURCES = algorithms.c fifo.c lru.c lfu.c optimal.c utils.c main_wrapper.c cli_runner.c
OBJECTS = $(SOURCES:.c=.o)

all: shared cli

# Build shared library (for FFI usage)
shared: $(OBJECTS)
	mkdir -p build
	$(CC) $(CFLAGS) $(SHARED_CFLAGS) -o $(TARGET).so algorithms.o fifo.o lru.o lfu.o optimal.o utils.o main_wrapper.o

# Build CLI executable (simple runner)
cli: $(OBJECTS)
	mkdir -p build
	$(CC) $(CFLAGS) -o $(CLI_TARGET) $(OBJECTS)

%.o: %.c
	$(CC) $(CFLAGS) -c $<

test:
	@echo "Running C tests..."
	# Add test commands here

clean:
	rm -f $(OBJECTS) build/algorithms.so $(CLI_TARGET)

.PHONY: all shared cli test clean
