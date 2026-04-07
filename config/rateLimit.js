const rateLimit = require("express-rate-limit");
const env = require("./envValidator");

const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.AUTH_RATE_LIMIT_MAX,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const passwordAttemptLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: 3,
  message: {
    success: false,
    message: "Too many password attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const refreshTokenLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: 30,
  message: {
    success: false,
    message: "Too many token refresh attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  authLimiter,
  refreshTokenLimiter,
  passwordAttemptLimiter,
};
