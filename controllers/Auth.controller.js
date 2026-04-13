const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const result = await authService.rotateRefreshToken(refreshToken);

  if (!result) {
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }

  res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
});

module.exports = {
  refreshAccessToken,
};