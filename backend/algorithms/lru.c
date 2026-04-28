#include "algorithmInterface.h"
#include "utils.h"
#include <stdlib.h>
#include <string.h>

// LRU (Least Recently Used) Page Replacement Algorithm

SimulationResult* lru_simulate(int* pageSequence, int sequenceLength, int frameSize) {
  SimulationResult* result = create_result(sequenceLength, frameSize);
  
  // Initialize frames with -1 (empty)
  for (int i = 0; i < frameSize; i++) {
    result->frames[i] = -1;
  }
  
  int* lastUsed = (int*)malloc(frameSize * sizeof(int));
  for (int i = 0; i < frameSize; i++) {
    lastUsed[i] = -1;
  }
  
  int pageFaults = 0;
  int frameCount = 0;
  
  for (int i = 0; i < sequenceLength; i++) {
    int page = pageSequence[i];
    int pageIndex = find_page_in_frames(result->frames, frameSize, page);
    
    if (pageIndex != -1) {
      // Page already in frames
      lastUsed[pageIndex] = i;
      result->faultSequence[i] = 0;
    } else {
      // Page fault
      if (frameCount < frameSize) {
        result->frames[frameCount] = page;
        lastUsed[frameCount] = i;
        frameCount++;
      } else {
        // Find LRU page
        int lruIndex = 0;
        for (int j = 1; j < frameSize; j++) {
          if (lastUsed[j] < lastUsed[lruIndex]) {
            lruIndex = j;
          }
        }
        result->frames[lruIndex] = page;
        lastUsed[lruIndex] = i;
      }
      pageFaults++;
      result->faultSequence[i] = 1;
    }
  }
  
  result->pageFaults = pageFaults;
  result->sequenceLength = sequenceLength;
  result->frameSize = frameSize;
  
  free(lastUsed);
  return result;
}
