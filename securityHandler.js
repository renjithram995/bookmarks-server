const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const appSecurity = (app) => {
  app.use(cors());
  app.use(helmet());
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  });

  // Apply the rate limiting middleware to all requests.
  app.use(limiter);
};

module.exports = appSecurity;