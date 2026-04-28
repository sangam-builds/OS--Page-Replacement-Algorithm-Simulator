// Simulator Engine - runs algorithms in JS and returns per-step snapshots

const SimulatorEngine = (function() {
  function snapshot(frames, seqLen, frameSize) {
    // return a shallow copy of frames array of length frameSize
    const s = new Array(frameSize);
    for (let i=0;i<frameSize;i++) s[i] = (i < frames.length) ? frames[i] : -1;
    return s;
  }

  function fifo(pageSequence, frameSize) {
    const frames = [];
    const steps = [];
    let nextIndex = 0;

    for (let i = 0; i < pageSequence.length; i++) {
      const page = pageSequence[i];
      const inFrame = frames.indexOf(page) !== -1;
      let evicted = null;
      let newlyLoaded = null;
      let status = 'HIT';

      if (!inFrame) {
        status = 'FAULT';
        if (frames.length < frameSize) {
          frames.push(page);
          newlyLoaded = page;
        } else {
          evicted = frames[nextIndex];
          frames[nextIndex] = page;
          newlyLoaded = page;
          nextIndex = (nextIndex + 1) % frameSize;
        }
      }

      steps.push({
        index: i+1,
        page,
        frames: snapshot(frames, i+1, frameSize),
        evicted,
        status,
        newlyLoaded
      });
    }

    return steps;
  }

  function lru(pageSequence, frameSize) {
    const frames = [];
    const lastUsed = new Map();
    const steps = [];

    for (let i = 0; i < pageSequence.length; i++) {
      const page = pageSequence[i];
      const pos = frames.indexOf(page);
      let evicted = null;
      let newlyLoaded = null;
      let status = 'HIT';

      if (pos !== -1) {
        lastUsed.set(page, i);
      } else {
        status = 'FAULT';
        if (frames.length < frameSize) {
          frames.push(page);
          lastUsed.set(page, i);
          newlyLoaded = page;
        } else {
          // find LRU
          let lruPage = frames[0];
          let lruTime = lastUsed.get(lruPage) ?? -1;
          for (const p of frames) {
            const t = lastUsed.get(p) ?? -1;
            if (t < lruTime) { lruTime = t; lruPage = p; }
          }
          const idx = frames.indexOf(lruPage);
          evicted = frames[idx];
          frames[idx] = page;
          lastUsed.delete(evicted);
          lastUsed.set(page, i);
          newlyLoaded = page;
        }
      }

      steps.push({ index: i+1, page, frames: snapshot(frames, i+1, frameSize), evicted, status, newlyLoaded });
    }

    return steps;
  }

  function lfu(pageSequence, frameSize) {
    const frames = [];
    const freq = new Map();
    const steps = [];

    for (let i = 0; i < pageSequence.length; i++) {
      const page = pageSequence[i];
      const pos = frames.indexOf(page);
      let evicted = null;
      let newlyLoaded = null;
      let status = 'HIT';

      if (pos !== -1) {
        freq.set(page, (freq.get(page)||0) + 1);
      } else {
        status = 'FAULT';
        if (frames.length < frameSize) {
          frames.push(page);
          freq.set(page, (freq.get(page)||0)+1);
          newlyLoaded = page;
        } else {
          // find LFU
          let lfuPage = frames[0];
          let lfuCount = freq.get(lfuPage) || 0;
          for (const p of frames) {
            const c = freq.get(p) || 0;
            if (c < lfuCount) { lfuCount = c; lfuPage = p; }
          }
          const idx = frames.indexOf(lfuPage);
          evicted = frames[idx];
          frames[idx] = page;
          freq.delete(evicted);
          freq.set(page, (freq.get(page)||0)+1);
          newlyLoaded = page;
        }
      }

      steps.push({ index: i+1, page, frames: snapshot(frames, i+1, frameSize), evicted, status, newlyLoaded });
    }

    return steps;
  }

  function optimal(pageSequence, frameSize) {
    const frames = [];
    const steps = [];

    for (let i = 0; i < pageSequence.length; i++) {
      const page = pageSequence[i];
      const pos = frames.indexOf(page);
      let evicted = null;
      let newlyLoaded = null;
      let status = 'HIT';

      if (pos !== -1) {
        // hit
      } else {
        status = 'FAULT';
        if (frames.length < frameSize) {
          frames.push(page);
          newlyLoaded = page;
        } else {
          // find farthest next use
          let farIndex = -1;
          let farFrameIdx = 0;
          for (let fi = 0; fi < frames.length; fi++) {
            const fpage = frames[fi];
            let nextUse = Infinity;
            for (let j = i+1; j < pageSequence.length; j++) {
              if (pageSequence[j] === fpage) { nextUse = j; break; }
            }
            if (nextUse > farIndex) { farIndex = nextUse; farFrameIdx = fi; }
          }
          evicted = frames[farFrameIdx];
          frames[farFrameIdx] = page;
          newlyLoaded = page;
        }
      }

      steps.push({ index: i+1, page, frames: snapshot(frames, i+1, frameSize), evicted, status, newlyLoaded });
    }

    return steps;
  }

  function run(algorithm, pageSequence, frameSize) {
    if (!Array.isArray(pageSequence)) pageSequence = [];
    switch ((algorithm||'').toUpperCase()) {
      case 'FIFO': return fifo(pageSequence, frameSize);
      case 'LRU': return lru(pageSequence, frameSize);
      case 'LFU': return lfu(pageSequence, frameSize);
      case 'OPTIMAL': return optimal(pageSequence, frameSize);
      default: return fifo(pageSequence, frameSize);
    }
  }

  return { run };
})();

// Export for browser usage
if (typeof window !== 'undefined') window.SimulatorEngine = SimulatorEngine;
