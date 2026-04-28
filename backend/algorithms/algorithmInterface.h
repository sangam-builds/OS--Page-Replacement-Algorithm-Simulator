#ifndef ALGORITHM_INTERFACE_H
#define ALGORITHM_INTERFACE_H

typedef struct {
  int* pageSequence;
  int sequenceLength;
  int frameSize;
  int* frames;
  int pageFaults;
  int* faultSequence;
} SimulationResult;

typedef SimulationResult* (*AlgorithmFunc)(int*, int, int);

SimulationResult* fifo_simulate(int* pageSequence, int sequenceLength, int frameSize);
SimulationResult* lru_simulate(int* pageSequence, int sequenceLength, int frameSize);
SimulationResult* lfu_simulate(int* pageSequence, int sequenceLength, int frameSize);
SimulationResult* optimal_simulate(int* pageSequence, int sequenceLength, int frameSize);

// Generic simulator entry used by wrapper/CLI
SimulationResult* simulate_algorithm(const char* algorithm, int* pageSequence, int sequenceLength, int frameSize);

void free_result(SimulationResult* result);

#endif
