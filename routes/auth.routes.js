const express = require("express");
const authRouter = express.Router();

const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");
const { refreshTokenLimiter } = require("../config/rateLimit");

const validateRequest = require("../middlewares/validateRequest");
const { z } = require("zod");

const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const user = await authService.findUserByRefreshToken(refreshToken);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }

  await authService.removeRefreshToken(user.userId, refreshToken);

  const { accessToken, refreshToken: newRefreshToken } =
    authService.generateTokens(user.userId, user.role);

  await authService.storeRefreshToken(user.userId, newRefreshToken);

  res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    accessToken,
    refreshToken: newRefreshToken,
  });
});

authRouter.route("/refresh-token").post(
  refreshTokenLimiter,
  validateRequest(refreshTokenSchema),
  refreshAccessToken
);

module.exports = authRouter;
