// Custom Logging Middleware
// Mencetak metode HTTP, URL yang diakses, dan timestamp pada setiap request
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

module.exports = logger;
