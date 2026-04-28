#include "algorithmInterface.h"
#include <stdlib.h>
#include <string.h>

// Main wrapper for Node.js FFI integration

SimulationResult* simulate_algorithm(const char* algorithm, int* pageSequence, int sequenceLength, int frameSize) {
  if (strcmp(algorithm, "FIFO") == 0) {
    return fifo_simulate(pageSequence, sequenceLength, frameSize);
  } else if (strcmp(algorithm, "LRU") == 0) {
    return lru_simulate(pageSequence, sequenceLength, frameSize);
  } else if (strcmp(algorithm, "LFU") == 0) {
    return lfu_simulate(pageSequence, sequenceLength, frameSize);
  } else if (strcmp(algorithm, "Optimal") == 0) {
    return optimal_simulate(pageSequence, sequenceLength, frameSize);
  }
  return NULL;
}

void free_result(SimulationResult* result) {
  if (result != NULL) {
    free(result->frames);
    free(result->faultSequence);
    free(result);
  }
}
