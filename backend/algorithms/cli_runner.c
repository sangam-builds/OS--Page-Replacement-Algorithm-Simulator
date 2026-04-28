#include "algorithmInterface.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Simple CLI runner:
// Usage: algorithms_cli <ALGORITHM> <comma-separated-page-sequence> <frameSize>
// Example: algorithms_cli FIFO 7,0,1,2,0,3,0,4 3

int main(int argc, char** argv) {
    if (argc < 4) {
        fprintf(stderr, "Usage: %s <ALGORITHM> <pageSequenceCommaSeparated> <frameSize>\n", argv[0]);
        return 1;
    }

    const char* algorithm = argv[1];
    const char* seqStr = argv[2];
    int frameSize = atoi(argv[3]);

    // Parse page sequence
    // Count commas to estimate length
    int len = 1;
    for (const char* p = seqStr; *p; ++p) if (*p == ',') ++len;

    int* seq = (int*)malloc(len * sizeof(int));
    int idx = 0;
    char* copy = strdup(seqStr);
    char* tok = strtok(copy, ",");
    while (tok && idx < len) {
        seq[idx++] = atoi(tok);
        tok = strtok(NULL, ",");
    }
    free(copy);

    SimulationResult* res = simulate_algorithm(algorithm, seq, idx, frameSize);
    if (!res) {
        fprintf(stderr, "Algorithm not found or error during simulation\n");
        free(seq);
        return 2;
    }

    // Output JSON
    printf("{\"pageFaults\":%d,\"frameSize\":%d,\"sequenceLength\":%d,\"frames\":[",
           res->pageFaults, res->frameSize, res->sequenceLength);
    for (int i = 0; i < res->frameSize; ++i) {
        printf("%d", res->frames[i]);
        if (i + 1 < res->frameSize) printf(",");
    }
    printf("],\"faultSequence\":[");
    for (int i = 0; i < res->sequenceLength; ++i) {
        printf("%d", res->faultSequence[i]);
        if (i + 1 < res->sequenceLength) printf(",");
    }
    printf("]}\n");

    free_result(res);
    free(seq);
    return 0;
}
