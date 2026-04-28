#ifndef ALGORITHMS_H
#define ALGORITHMS_H

#include "algorithmInterface.h"

// Algorithm implementations
SimulationResult* fifo_simulate(int* pageSequence, int sequenceLength, int frameSize);
SimulationResult* lru_simulate(int* pageSequence, int sequenceLength, int frameSize);
SimulationResult* lfu_simulate(int* pageSequence, int sequenceLength, int frameSize);
SimulationResult* optimal_simulate(int* pageSequence, int sequenceLength, int frameSize);

#endif
