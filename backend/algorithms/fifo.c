#include "algorithmInterface.h"
#include "utils.h"
#include <stdlib.h>
#include <string.h>

// FIFO (First In First Out) Page Replacement Algorithm

SimulationResult* fifo_simulate(int* pageSequence, int sequenceLength, int frameSize) {
  SimulationResult* result = create_result(sequenceLength, frameSize);
  
  // Initialize frames with -1 (empty)
  for (int i = 0; i < frameSize; i++) {
    result->frames[i] = -1;
  }
  
  int pageFaults = 0;
  int nextFrameIndex = 0;
  
  for (int i = 0; i < sequenceLength; i++) {
    int page = pageSequence[i];
    
    if (!is_page_in_frames(result->frames, frameSize, page)) {
      // Page fault - replace with FIFO
      result->frames[nextFrameIndex] = page;
      nextFrameIndex = (nextFrameIndex + 1) % frameSize;
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
