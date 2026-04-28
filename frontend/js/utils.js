// Utility Functions

const Utils = {
  formatNumber: function(num) {
    return num.toLocaleString();
  },

  parsePageSequence: function(str) {
    return str.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p));
  },

  calculateFaultRate: function(faults, total) {
    return (faults / total * 100).toFixed(2);
  },

  debounce: function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};
