require("dotenv").config();

const requiredEnvVars = [
  "PORT",
  "DEP_FRONTEND_URL",
  "DEV_FRONTEND_URL",
  "MONGODB_URL",
];

function validateEnvVars() {
  const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    console.error(
      `🚨 Missing environment variables: ${missingVars.join(", ")}`
    );
    process.exit(1);
  }

  if (process.env.NODE_ENV !== "test") {
    validateEnvVars();
    console.log("✅ All required environment variables are set.");
  }
}

// Automatically run validation on import (except during test runner bootstrapping)
// if (require.main !== module) {

module.exports = {
  validateEnvVars,
  PORT: process.env.PORT || 8001,
  DEP_FRONTEND_URL: process.env.DEP_FRONTEND_URL,
  DEV_FRONTEND_URL: process.env.DEV_FRONTEND_URL,
  MONGODB_URL: process.env.MONGODB_URL,
};
