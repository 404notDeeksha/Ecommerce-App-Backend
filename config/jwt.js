const env = require("./envValidator");

const jwtConfig = {
  accessTokenSecret: env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: env.REFRESH_TOKEN_SECRET,
  accessTokenExpiry: env.ACCESS_TOKEN_EXPIRY,
  refreshTokenExpiry: env.REFRESH_TOKEN_EXPIRY,
};

module.exports = jwtConfig;
