// Simulation Controller (uses client-side engine for per-step snapshots)

const Simulator = {
  async run(algorithm, pageSequence, frameSize) {
    UI.showLoading();

    try {
      // Use client-side engine to compute per-step snapshots (fast, UI-friendly)
      const steps = window.SimulatorEngine.run(algorithm, pageSequence, frameSize);

      // Display statistics derived from engine
      const pageFaults = steps.filter(s => s.status === 'FAULT').length;
      const seqLen = steps.length;
      const faultRate = seqLen > 0 ? (pageFaults / seqLen * 100) : 0;
      const stats = { pageFaults, faultRate, frameSize, sequenceLength: seqLen };
      UI.displayStatistics(stats);

      // Render visualization for last frame
      if (steps.length) {
        const last = steps[steps.length-1];
        Visualizer.renderFrames(last.frames);
      }

      // Render step-by-step results table
      this.renderResultsTable(steps, frameSize);

      // Additionally call backend to log or compute authoritative result if desired (non-blocking)
      API.simulate(algorithm, pageSequence, frameSize).catch(() => {});

    } catch (error) {
      UI.showError(error.message);
    }
  },

  renderResultsTable(steps, frameSize) {
    const container = document.getElementById('resultsTable');
    if (!container) return;
    container.innerHTML = '';
    if (!steps || !steps.length) { container.innerHTML = '<p>No steps to display</p>'; return; }

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    ['#','Page Ref', ...Array.from({length: frameSize}, (_,i)=>`Frame ${i+1}`), 'Evicted', 'Status'].forEach(h => {
      const th = document.createElement('th'); th.textContent = h; headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    const tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);

    const delayMs = 220; // stagger per-row

    steps.forEach((s, idx) => {
      setTimeout(() => {
        const tr = document.createElement('tr');
        tr.classList.add('row-enter');

        const tdIndex = document.createElement('td'); tdIndex.textContent = s.index; tr.appendChild(tdIndex);

        const tdPage = document.createElement('td');
        const pageStrong = document.createElement('strong'); pageStrong.style.color = '#6fb4ff'; pageStrong.textContent = s.page;
        tdPage.appendChild(pageStrong); tr.appendChild(tdPage);

        for (let fi=0; fi<frameSize; fi++) {
          const td = document.createElement('td');
          const span = document.createElement('span');
          span.className = 'frame-cell';
          const val = (typeof s.frames[fi] === 'number' && s.frames[fi] >= 0) ? s.frames[fi] : '-';
          span.textContent = val;
          const isNew = s.newlyLoaded !== null && s.newlyLoaded === s.frames[fi];
          if (isNew) span.classList.add('new');
          td.appendChild(span);
          tr.appendChild(td);
        }

        const tdEv = document.createElement('td');
        if (s.evicted !== null && s.evicted !== undefined) {
          const ev = document.createElement('span'); ev.className = 'evicted enter'; ev.textContent = '← ' + s.evicted; tdEv.appendChild(ev);
          // remove temporary enter class after animation
          setTimeout(() => ev.classList.remove('enter'), 300);
        } else {
          tdEv.textContent = '—';
        }
        tr.appendChild(tdEv);

        const tdStatus = document.createElement('td');
        if (s.status === 'HIT') {
          const sp = document.createElement('span'); sp.className = 'status-hit'; sp.textContent = 'HIT ✓'; tdStatus.appendChild(sp);
        } else {
          const sp = document.createElement('span'); sp.className = 'status-fault'; sp.textContent = 'FAULT ✕'; tdStatus.appendChild(sp);
        }
        tr.appendChild(tdStatus);

        tbody.appendChild(tr);

        // optional auto-scroll to newest row
        if (idx > 6) {
          tr.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, idx * delayMs);
    });
  }
};
