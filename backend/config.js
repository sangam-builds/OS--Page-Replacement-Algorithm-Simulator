module.exports = {
  port: process.env.PORT || 3000,
  algorithmPath: './algorithms/build/algorithms',
  environment: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info'
};
