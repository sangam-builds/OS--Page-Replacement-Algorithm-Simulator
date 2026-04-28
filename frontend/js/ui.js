// UI Management

const UI = {
  init: function() {
    console.log('UI initialized');
  },

  displayStatistics: function(stats) {
    const statsDiv = document.getElementById('statistics');
    const faultRate = (Number.isFinite(stats.faultRate) ? stats.faultRate : 0);
    statsDiv.innerHTML = `
      <div class="stat-card">
        <div class="stat-label">Page Faults</div>
        <div class="stat-value">${stats.pageFaults}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Fault Rate</div>
        <div class="stat-value">${faultRate.toFixed(2)}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Frame Size</div>
        <div class="stat-value">${stats.frameSize}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Sequence Length</div>
        <div class="stat-value">${stats.sequenceLength}</div>
      </div>
    `;
  },

  showError: function(message) {
    alert('Error: ' + message);
  },

  showLoading: function() {
    const visualizer = document.getElementById('visualizer');
    visualizer.innerHTML = '<p>Running simulation...</p>';
  }
};
