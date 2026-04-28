#include "utils.h"
#include <stdlib.h>

int is_page_in_frames(int* frames, int frameSize, int page) {
  for (int i = 0; i < frameSize; i++) {
    if (frames[i] == page) return 1;
  }
  return 0;
}

int find_page_in_frames(int* frames, int frameSize, int page) {
  for (int i = 0; i < frameSize; i++) {
    if (frames[i] == page) return i;
  }
  return -1;
}

SimulationResult* create_result(int sequenceLength, int frameSize) {
  SimulationResult* result = (SimulationResult*)malloc(sizeof(SimulationResult));
  result->frames = (int*)malloc(frameSize * sizeof(int));
  result->faultSequence = (int*)malloc(sequenceLength * sizeof(int));
  return result;
}
