const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = authService.verifyAccessToken(token);
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
        code: "TOKEN_EXPIRED",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

module.exports = authMiddleware;
