# Page Replacement Algorithm Explanation

This document provides detailed explanations of the page replacement algorithms implemented in this simulator.

## 1. FIFO (First In First Out)

FIFO is the simplest page replacement algorithm.

### How it works:
- Maintains a queue of pages in memory
- When a page fault occurs, the oldest page (first inserted) is removed
- The new page is added to the queue

### Advantages:
- Simple to implement
- Low overhead

### Disadvantages:
- May remove frequently used pages
- Can cause "Belady's Anomaly" (more frames can lead to more page faults)

## 2. LRU (Least Recently Used)

LRU replaces the page that has not been used for the longest time.

### How it works:
- Tracks the access time of each page
- When a page fault occurs, the page with the oldest access time is replaced
- Requires updating timestamps on every memory access

### Advantages:
- Good performance in most cases
- Considers page usage patterns

### Disadvantages:
- More expensive than FIFO
- Requires tracking access times

## 3. LFU (Least Frequently Used)

LFU replaces the page with the lowest frequency of use.

### How it works:
- Maintains a frequency counter for each page
- When a page fault occurs, the page with the lowest counter is replaced
- Counters are incremented on each access

### Advantages:
- Considers page usage frequency
- Good for workloads with distinct access patterns

### Disadvantages:
- Requires frequency tracking
- May not adapt quickly to changing access patterns

## 4. Optimal (Belady's Algorithm)

Optimal algorithm replaces the page that will not be used for the longest time in the future.

### How it works:
- Requires knowledge of future page references
- When a page fault occurs, replace the page that will be accessed farthest in the future
- This is purely theoretical and cannot be implemented in practice

### Advantages:
- Minimizes page faults
- Provides a benchmark for other algorithms

### Disadvantages:
- Not implementable in real systems
- Requires future knowledge

## Comparison

| Aspect | FIFO | LRU | LFU | Optimal |
|--------|------|-----|-----|---------|
| Complexity | Low | Medium | Medium | High |
| Performance | Poor | Good | Good | Best |
| Overhead | Low | Medium | Medium | High |
| Implementable | Yes | Yes | Yes | No |

