const express = require('express');
const path = require('path');
const config = require('./config');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server with graceful error handling for port conflicts
const PORT = config.port || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.\n` +
      `Either stop the process using the port or set a different port via PORT environment variable.`);
    console.error('Example to stop process on Windows (PowerShell):');
    console.error("Get-NetTCPConnection -LocalPort 3000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }");
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

module.exports = app;
