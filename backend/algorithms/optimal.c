#include "algorithmInterface.h"
#include "utils.h"
#include <stdlib.h>
#include <string.h>

// Optimal Page Replacement Algorithm (Belady's Algorithm)

int find_farthest_page(int* frames, int frameSize, int* pageSequence, int sequenceLength, int currentIndex) {
  int farthestIndex = 0;
  int farthestPage = -1;
  
  for (int i = 0; i < frameSize; i++) {
    int nextUse = -1;
    for (int j = currentIndex + 1; j < sequenceLength; j++) {
      if (pageSequence[j] == frames[i]) {
        nextUse = j;
        break;
      }
    }
    if (nextUse == -1) {
      // Page is never used again
      return i;
    }
    if (nextUse > farthestPage) {
      farthestPage = nextUse;
      farthestIndex = i;
    }
  }
  
  return farthestIndex;
}

SimulationResult* optimal_simulate(int* pageSequence, int sequenceLength, int frameSize) {
  SimulationResult* result = create_result(sequenceLength, frameSize);
  
  // Initialize frames with -1 (empty)
  for (int i = 0; i < frameSize; i++) {
    result->frames[i] = -1;
  }
  
  int pageFaults = 0;
  int frameCount = 0;
  
  for (int i = 0; i < sequenceLength; i++) {
    int page = pageSequence[i];
    
    if (!is_page_in_frames(result->frames, frameSize, page)) {
      // Page fault
      if (frameCount < frameSize) {
        result->frames[frameCount] = page;
        frameCount++;
      } else {
        // Replace farthest page
        int farthestIndex = find_farthest_page(result->frames, frameSize, pageSequence, sequenceLength, i);
        result->frames[farthestIndex] = page;
      }
      pageFaults++;
      result->faultSequence[i] = 1;
    } else {
      result->faultSequence[i] = 0;
    }
  }
  
  result->pageFaults = pageFaults;
  result->sequenceLength = sequenceLength;
  result->frameSize = frameSize;
  
  return result;
}
