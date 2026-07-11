// Custom logging middleware to output readable API requests in console
const logger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const method = req.method;
    const url = req.originalUrl;
    const status = res.statusCode;
    
    // Simple color representations for terminal output
    let statusColor = '\x1b[32m'; // Green
    if (status >= 400 && status < 500) {
      statusColor = '\x1b[33m'; // Yellow
    } else if (status >= 500) {
      statusColor = '\x1b[31m'; // Red
    }
    
    console.log(`[MindFlow API] ${method} ${url} - ${statusColor}${status}\x1b[0m in ${duration}ms`);
  });
  next();
};

module.exports = logger;
