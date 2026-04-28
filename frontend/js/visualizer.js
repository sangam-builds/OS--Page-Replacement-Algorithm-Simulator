// Data Visualization

const Visualizer = {
  renderFrames: function(frames) {
    const visualizer = document.getElementById('visualizer');
    visualizer.innerHTML = '';

    // Render current frames as blocks
    frames.forEach((frame) => {
      const blockDiv = document.createElement('div');
      blockDiv.className = 'frame-block';
      blockDiv.textContent = (typeof frame === 'number' && frame >= 0) ? frame : 'Empty';
      visualizer.appendChild(blockDiv);
    });
  },

  renderTimeline: function(faultSequence) {
    const timeline = document.createElement('div');
    timeline.style.display = 'flex';
    timeline.style.gap = '0.5rem';
    timeline.style.marginTop = '1rem';
    
    faultSequence.forEach((fault, index) => {
      const marker = document.createElement('span');
      marker.style.width = '20px';
      marker.style.height = '20px';
      marker.style.borderRadius = '50%';
      marker.style.backgroundColor = fault ? '#e74c3c' : '#27ae60';
      marker.title = `Page ${index}: ${fault ? 'Fault' : 'Hit'}`;
      timeline.appendChild(marker);
    });
    
    return timeline;
  }
};
