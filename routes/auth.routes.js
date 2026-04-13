const express = require("express");
const authRouter = express.Router();

const { refreshAccessToken } = require("../controllers/Auth.controller");
const { refreshTokenLimiter } = require("../config/rateLimit");
const validateRequest = require("../middlewares/validateRequest");
const { refreshTokenSchema } = require("../validations/user.schema");

authRouter.route("/refresh-token").post(
  refreshTokenLimiter,
  validateRequest(refreshTokenSchema),
  refreshAccessToken
);

module.exports = authRouter;