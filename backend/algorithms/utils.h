#ifndef UTILS_H
#define UTILS_H

#include "algorithmInterface.h"

// Utility functions for algorithm implementations
int is_page_in_frames(int* frames, int frameSize, int page);
int find_page_in_frames(int* frames, int frameSize, int page);
SimulationResult* create_result(int sequenceLength, int frameSize);

#endif
