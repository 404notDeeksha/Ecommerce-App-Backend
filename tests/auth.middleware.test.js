const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth.middleware");
const authService = require("../services/auth.service");

jest.mock("../services/auth.service");

describe("Auth Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test("Returns 401 if no authorization header", async () => {
    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Access denied. No token provided.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("Returns 401 if authorization header does not start with Bearer", async () => {
    req.headers.authorization = "Token abc123";

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Access denied. No token provided.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("Returns 401 with TOKEN_EXPIRED code if token expired", async () => {
    req.headers.authorization = "Bearer expiredtoken";
    const error = new Error("Token expired");
    error.name = "TokenExpiredError";
    authService.verifyAccessToken.mockImplementation(() => {
      throw error;
    });

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Token expired",
      code: "TOKEN_EXPIRED",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("Returns 401 with Invalid token message for other JWT errors", async () => {
    req.headers.authorization = "Bearer invalidtoken";
    authService.verifyAccessToken.mockImplementation(() => {
      throw new Error("JsonWebTokenError");
    });

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("Attaches user to req and calls next on valid token", async () => {
    req.headers.authorization = "Bearer validtoken";
    authService.verifyAccessToken.mockReturnValue({
      userId: "user-123",
      role: "admin",
    });

    await authMiddleware(req, res, next);

    expect(req.user).toEqual({ userId: "user-123", role: "admin" });
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test("Extracts token correctly from Bearer string", async () => {
    req.headers.authorization = "Bearer mytoken123";
    authService.verifyAccessToken.mockReturnValue({
      userId: "user-456",
      role: "user",
    });

    await authMiddleware(req, res, next);

    expect(authService.verifyAccessToken).toHaveBeenCalledWith("mytoken123");
    expect(next).toHaveBeenCalled();
  });
});
