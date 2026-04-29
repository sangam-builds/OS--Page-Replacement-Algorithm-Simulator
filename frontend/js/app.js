const ALGORITHMS = ['FIFO', 'LRU', 'LFU', 'Optimal'];
const PRESETS = [
  { label: 'Classic', sequence: '7 0 1 2 0 3 0 4 2 3 0 3 2', frames: 3 },
  { label: 'Dense reuse', sequence: '1 2 3 2 4 1 5 2 1 2 3 4 5', frames: 4 },
  { label: 'Short burst', sequence: '2 3 2 1 5 2 4 5 3 2', frames: 3 },
  { label: 'Streaming', sequence: '9 8 7 6 5 4 3 2 1 0', frames: 4 }
];

const state = {
  selectedAlgorithm: 'FIFO',
  comparison: null,
  sequence: [],
  frameSize: 3
};

const charts = {
  pie: null,
  donut: null,
  radar: null,
  groupbar: null
};

document.addEventListener('DOMContentLoaded', () => {
  setupNavbarToggle();
  setupRevealObserver();
  setupPresetButtons();
  setupAlgorithmSelect();
  bindControls();
  renderTraceTabs();
});

window.runSimulation = runSimulation;
window.resetSimulation = resetSimulation;

function setupNavbarToggle() {
  const toggleButton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('navLinks');

  if (!toggleButton || !nav) {
    return;
  }

  toggleButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggleButton.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggleButton.setAttribute('aria-expanded', 'false');
    });
  });
}

function setupRevealObserver() {
  const revealElements = document.querySelectorAll('.reveal');

  if (!revealElements.length) {
    return;
  }

  if (typeof IntersectionObserver === 'undefined') {
    revealElements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function setupPresetButtons() {
  const container = document.getElementById('presets');

  if (!container) {
    return;
  }

  container.innerHTML = '';

  PRESETS.forEach((preset, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'preset-chip';
    button.textContent = preset.label;
    if (index === 0) {
      button.classList.add('is-active');
    }

    button.addEventListener('click', () => {
      container.querySelectorAll('.preset-chip').forEach((chip) => chip.classList.remove('is-active'));
      button.classList.add('is-active');

      const sequenceInput = document.getElementById('ref-string');
      const framesInput = document.getElementById('frames');

      if (sequenceInput) {
        sequenceInput.value = preset.sequence;
      }
      if (framesInput) {
        framesInput.value = String(preset.frames);
      }

      runSimulation();
    });

    container.appendChild(button);
  });
}

function setupAlgorithmSelect() {
  const select = document.getElementById('algorithm-select');
  if (!select) {
    return;
  }

  select.value = '';
  select.addEventListener('change', () => {
    state.selectedAlgorithm = select.value || state.selectedAlgorithm;
  });
}

function bindControls() {
  const runButton = document.querySelector('.run-btn');
  const resetButton = document.querySelector('.reset-btn');
  const sequenceInput = document.getElementById('ref-string');
  const framesInput = document.getElementById('frames');
  const algorithmSelect = document.getElementById('algorithm-select');

  if (runButton) {
    runButton.addEventListener('click', runSimulation);
  }

  if (resetButton) {
    resetButton.addEventListener('click', resetSimulation);
  }

  [sequenceInput, framesInput, algorithmSelect].forEach((input) => {
    if (!input) {
      return;
    }

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        runSimulation();
      }
    });
  });
}

function resetSimulation() {
  const sequenceInput = document.getElementById('ref-string');
  const framesInput = document.getElementById('frames');
  const algorithmSelect = document.getElementById('algorithm-select');
  const error = document.getElementById('error');
  const algorithmsSection = document.getElementById('algorithms');

  if (sequenceInput && PRESETS.length) {
    sequenceInput.value = PRESETS[0].sequence;
  }

  if (framesInput && PRESETS.length) {
    framesInput.value = String(PRESETS[0].frames);
  }

  if (algorithmSelect) {
    algorithmSelect.value = '';
  }

  state.selectedAlgorithm = 'FIFO';
  state.sequence = [];
  state.frameSize = PRESETS.length ? PRESETS[0].frames : state.frameSize;
  state.comparison = null;

  if (error) {
    error.textContent = '';
  }

  const presetContainer = document.getElementById('presets');
  if (presetContainer) {
    presetContainer.querySelectorAll('.preset-chip').forEach((chip, index) => {
      chip.classList.toggle('is-active', index === 0);
    });
  }

  if (algorithmsSection) {
    algorithmsSection.hidden = true;
  }

  ['trace-tabs', 'trace-body', 'donut-selector', 'pie-legend', 'donut-legend', 'radar-legend'].forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.innerHTML = '';
    }
  });

  Object.keys(charts).forEach((key) => {
    if (charts[key]) {
      charts[key].destroy();
      charts[key] = null;
    }
  });
}

function parseSequence(value) {
  return value
    .split(/[\s,]+/)
    .map((part) => Number.parseInt(part, 10))
    .filter((part) => Number.isFinite(part));
}

function runSimulation() {
  const sequenceInput = document.getElementById('ref-string');
  const framesInput = document.getElementById('frames');
  const algorithmSelect = document.getElementById('algorithm-select');
  const error = document.getElementById('error');

  if (!sequenceInput || !framesInput) {
    return;
  }

  const sequence = parseSequence(sequenceInput.value);
  const frameSize = Number.parseInt(framesInput.value, 10);

  if (algorithmSelect && !algorithmSelect.value) {
    showError('Select an algorithm before running the simulation.');
    return;
  }

  if (!sequence.length) {
    showError('Enter at least one page reference.');
    return;
  }

  if (!Number.isFinite(frameSize) || frameSize < 1) {
    showError('Frame count must be at least 1.');
    return;
  }

  if (algorithmSelect && algorithmSelect.value) {
    state.selectedAlgorithm = algorithmSelect.value;
  }
  state.sequence = sequence;
  state.frameSize = frameSize;
  state.comparison = buildComparison(sequence, frameSize);

  if (error) {
    error.textContent = '';
  }

  const algorithmsSection = document.getElementById('algorithms');
  if (algorithmsSection) {
    algorithmsSection.hidden = false;
    algorithmsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  renderSummaryGrid();
  renderBars();
  renderTraceTabs();
  renderTraceBody(state.selectedAlgorithm);
  renderSelectedTabs();
  renderCharts();
}

function showError(message) {
  const error = document.getElementById('error');
  if (error) {
    error.textContent = message;
  }
}

function buildComparison(sequence, frameSize) {
  const comparison = {};

  ALGORITHMS.forEach((algorithm) => {
    const steps = window.SimulatorEngine.run(algorithm, sequence, frameSize);
    const faults = steps.filter((step) => step.status === 'FAULT').length;
    const hits = steps.length - faults;

    comparison[algorithm] = {
      steps,
      faults,
      hits,
      faultRate: sequence.length ? (faults / sequence.length) * 100 : 0,
      hitRate: sequence.length ? (hits / sequence.length) * 100 : 0,
      lastFrames: steps.length ? steps[steps.length - 1].frames : new Array(frameSize).fill(-1)
    };
  });

  return comparison;
}

function renderSummaryGrid() {
  const container = document.getElementById('summary-grid');
  if (!container || !state.comparison) {
    return;
  }

  container.innerHTML = '';

  ALGORITHMS.forEach((algorithm) => {
    const summary = state.comparison[algorithm];
    const card = document.createElement('article');
    card.className = 'summary-card';
    if (algorithm === state.selectedAlgorithm) {
      card.classList.add('is-active');
    }

    card.innerHTML = `
      <h3>${algorithm}</h3>
      <div class="summary-value">${summary.faults}</div>
      <div class="summary-meta">Page faults</div>
      <div class="summary-meta">${summary.hits} hits · ${summary.faultRate.toFixed(1)}% fault rate</div>
    `;

    container.appendChild(card);
  });
}

function renderBars() {
  const container = document.getElementById('bars');
  if (!container || !state.comparison) {
    return;
  }

  const maxFaults = Math.max(...ALGORITHMS.map((algorithm) => state.comparison[algorithm].faults), 1);
  container.innerHTML = '';

  ALGORITHMS.forEach((algorithm) => {
    const summary = state.comparison[algorithm];
    const barItem = document.createElement('div');
    barItem.className = 'bar-item';

    const barTrack = document.createElement('div');
    barTrack.className = 'bar-track';

    const barFill = document.createElement('div');
    barFill.className = 'bar-fill';
    barFill.style.height = `${Math.max((summary.faults / maxFaults) * 100, 8)}%`;

    barTrack.appendChild(barFill);

    barItem.innerHTML = `
      <div class="bar-label">${algorithm}</div>
      <div class="bar-meta">${summary.faults} faults</div>
    `;
    barItem.appendChild(barTrack);
    container.appendChild(barItem);
  });
}

function renderTraceTabs() {
  const tabs = document.getElementById('trace-tabs');
  if (!tabs) {
    return;
  }

  tabs.innerHTML = '';

  ALGORITHMS.forEach((algorithm) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'trace-tab';
    button.textContent = algorithm;
    if (algorithm === state.selectedAlgorithm) {
      button.classList.add('is-active');
    }

    button.addEventListener('click', () => {
      state.selectedAlgorithm = algorithm;
      renderSummaryGrid();
      renderTraceBody(algorithm);
      renderSelectedTabs();
      renderCharts();
      renderTraceTabs();
    });

    tabs.appendChild(button);
  });
}

function renderTraceBody(algorithm) {
  const container = document.getElementById('trace-body');
  if (!container || !state.comparison) {
    return;
  }

  const summary = state.comparison[algorithm];
  const table = document.createElement('table');
  table.className = 'trace-table';

  const headRow = document.createElement('tr');
  ['#', 'Page Ref', ...Array.from({ length: state.frameSize }, (_, index) => `Frame ${index + 1}`), 'Evicted', 'Status'].forEach((label) => {
    const th = document.createElement('th');
    th.textContent = label;
    headRow.appendChild(th);
  });

  const thead = document.createElement('thead');
  thead.appendChild(headRow);

  const tbody = document.createElement('tbody');
  summary.steps.forEach((step) => {
    const row = document.createElement('tr');

    const indexCell = document.createElement('td');
    indexCell.textContent = step.index;
    row.appendChild(indexCell);

    const pageCell = document.createElement('td');
    pageCell.innerHTML = `<strong style="color: var(--info);">${step.page}</strong>`;
    row.appendChild(pageCell);

    step.frames.forEach((frame) => {
      const frameCell = document.createElement('td');
      const frameValue = document.createElement('span');
      frameValue.className = 'frame-cell';
      if (step.newlyLoaded !== null && step.newlyLoaded === frame) {
        frameValue.classList.add('is-new');
      }
      frameValue.textContent = typeof frame === 'number' && frame >= 0 ? frame : '-';
      frameCell.appendChild(frameValue);
      row.appendChild(frameCell);
    });

    const evictedCell = document.createElement('td');
    if (step.evicted !== null && step.evicted !== undefined) {
      evictedCell.innerHTML = `<span class="trace-evicted">← ${step.evicted}</span>`;
    } else {
      evictedCell.textContent = '—';
    }
    row.appendChild(evictedCell);

    const statusCell = document.createElement('td');
    if (step.status === 'HIT') {
      statusCell.innerHTML = '<span class="trace-status-hit">HIT ✓</span>';
    } else {
      statusCell.innerHTML = '<span class="trace-status-fault">FAULT ✕</span>';
    }
    row.appendChild(statusCell);

    tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);

  container.innerHTML = '';
  container.appendChild(table);
}

function renderSelectedTabs() {
  const selector = document.getElementById('donut-selector');
  if (!selector) {
    return;
  }

  selector.innerHTML = '';

  ALGORITHMS.forEach((algorithm) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = algorithm;
    if (algorithm === state.selectedAlgorithm) {
      button.classList.add('is-active');
    }

    button.addEventListener('click', () => {
      state.selectedAlgorithm = algorithm;
      renderSummaryGrid();
      renderTraceTabs();
      renderTraceBody(algorithm);
      renderSelectedTabs();
      renderCharts();
    });

    selector.appendChild(button);
  });
}

function renderCharts() {
  if (!state.comparison || typeof Chart === 'undefined') {
    return;
  }

  const labels = ALGORITHMS;
  const faults = labels.map((algorithm) => state.comparison[algorithm].faults);
  const hits = labels.map((algorithm) => state.comparison[algorithm].hits);
  const selected = state.comparison[state.selectedAlgorithm];
  const len = Math.max(state.sequence.length, 1);

  drawChart('pie', document.getElementById('pie-chart'), {
    type: 'pie',
    data: {
      labels,
      datasets: [{ data: faults, backgroundColor: ['#ff7b5c', '#7cb7ff', '#22d3a0', '#ffd36b'] }]
    },
    options: chartOptions(false)
  });

  drawChart('donut', document.getElementById('donut-chart'), {
    type: 'doughnut',
    data: {
      labels: ['Hits', 'Faults'],
      datasets: [{ data: [selected.hits, selected.faults], backgroundColor: ['#22d3a0', '#ff7b5c'] }]
    },
    options: chartOptions(false)
  });

  drawChart('radar', document.getElementById('radar-chart'), {
    type: 'radar',
    data: {
      labels: ['Hit Rate', 'Fault Rate Inverse', 'Frame Fill', 'Reuse Score', 'Stability'],
      datasets: labels.map((algorithm, index) => {
        const summary = state.comparison[algorithm];
        const filledFrames = summary.lastFrames.filter((value) => value >= 0).length;
        const hitRate = summary.hits / len * 100;
        const faultInverse = 100 - summary.faultRate;
        const frameFill = state.frameSize > 0 ? (filledFrames / state.frameSize) * 100 : 0;
        const reuseScore = Math.max(0, 100 - (summary.faultRate / 2));
        const stability = Math.max(20, 100 - (summary.faults * 4));

        return {
          label: algorithm,
          data: [hitRate, faultInverse, frameFill, reuseScore, stability],
          borderColor: ['#ff7b5c', '#7cb7ff', '#22d3a0', '#ffd36b'][index],
          backgroundColor: ['rgba(255, 123, 92, 0.15)', 'rgba(124, 183, 255, 0.15)', 'rgba(34, 211, 160, 0.15)', 'rgba(255, 211, 107, 0.15)'][index],
          pointBackgroundColor: ['#ff7b5c', '#7cb7ff', '#22d3a0', '#ffd36b'][index],
          borderWidth: 2
        };
      })
    },
    options: chartOptions(true)
  });

  drawChart('groupbar', document.getElementById('groupbar-chart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Page Faults',
          data: faults,
          backgroundColor: '#f87171'
        },
        {
          label: 'Page Hits',
          data: hits,
          backgroundColor: '#22d3a0'
        }
      ]
    },
    options: {
      ...chartOptions(false),
      scales: {
        x: { ticks: { color: '#d7deea' }, grid: { color: 'rgba(255,255,255,0.06)' } },
        y: { beginAtZero: true, ticks: { color: '#d7deea', precision: 0 }, grid: { color: 'rgba(255,255,255,0.06)' } }
      }
    }
  });

  renderLegend('pie-legend', labels, ['#ff7b5c', '#7cb7ff', '#22d3a0', '#ffd36b']);
  renderLegend('donut-legend', ['Hits', 'Faults'], ['#22d3a0', '#ff7b5c']);
  renderLegend('radar-legend', labels, ['#ff7b5c', '#7cb7ff', '#22d3a0', '#ffd36b']);
}

function drawChart(key, canvas, config) {
  if (!canvas) {
    return;
  }

  if (charts[key]) {
    charts[key].destroy();
  }

  const context = canvas.getContext('2d');
  charts[key] = new Chart(context, {
    ...config,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(10, 14, 24, 0.95)',
          titleColor: '#f4f7fb',
          bodyColor: '#f4f7fb',
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1
        }
      },
      ...config.options
    }
  });
}

function chartOptions(isRadar) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: isRadar
      ? {
          r: {
            angleLines: { color: 'rgba(255,255,255,0.1)' },
            grid: { color: 'rgba(255,255,255,0.1)' },
            pointLabels: { color: '#f4f7fb', font: { size: 12, family: 'Inter' } },
            ticks: { backdropColor: 'transparent', color: '#d7deea' }
          }
        }
      : undefined,
    plugins: {
      legend: { display: false }
    }
  };
}

function renderLegend(containerId, labels, colors) {
  const container = document.getElementById(containerId);
  if (!container) {
    return;
  }

  container.innerHTML = '';

  labels.forEach((label, index) => {
    const item = document.createElement('div');
    item.className = 'chart-legend-item';
    const color = colors[index % colors.length];
    item.style.color = color;
    item.innerHTML = `<span class="chart-legend-dot" style="background:${color}"></span>${label}`;
    container.appendChild(item);
  });
}
