const env = require("../config/envValidator");

const allowedOrigins = [env.DEP_FRONTEND_URL, env.DEV_FRONTEND_URL];

const isVercelPreview = (origin) =>
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin || "");

const isAllowedOrigin = (origin) =>
  !origin || allowedOrigins.includes(origin) || isVercelPreview(origin);

module.exports = isAllowedOrigin;
