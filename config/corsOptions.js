const isAllowedOrigin = require("../utils/isAllowedOrigin");

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy: This origin is not allowed"));
    }
  },
  credentials: true,
};

module.exports = corsOptions;
