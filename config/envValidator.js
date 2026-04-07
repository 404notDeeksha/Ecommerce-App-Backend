require("dotenv").config();
const requiredEnvVars = [
  "PORT",
  "DEP_FRONTEND_URL",
  "DEV_FRONTEND_URL",
  "MONGODB_URL",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
];

const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  console.error(`🚨 Missing environment variables: ${missingVars.join(", ")}`);
  process.exit(1);
}

console.log("✅ All required environment variables are set.");

module.exports = {
  PORT: process.env.PORT || 8001,
  DEP_FRONTEND_URL: process.env.DEP_FRONTEND_URL,
  DEV_FRONTEND_URL: process.env.DEV_FRONTEND_URL,
  MONGODB_URL: process.env.MONGODB_URL,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "15m",
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  AUTH_RATE_LIMIT_MAX: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 5,
};
