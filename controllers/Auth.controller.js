const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");

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

module.exports = {
  refreshAccessToken,
};