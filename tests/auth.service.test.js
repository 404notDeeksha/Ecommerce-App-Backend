const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const authService = require("../services/auth.service");

describe("Auth Service", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("generateTokens", () => {
    test("Generates both access and refresh tokens", () => {
      const { accessToken, refreshToken } = authService.generateTokens("user-1", "admin");

      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
      expect(typeof accessToken).toBe("string");
      expect(typeof refreshToken).toBe("string");
    });

    test("Access token contains userId and role", () => {
      const { accessToken } = authService.generateTokens("user-123", "product_manager");
      const decoded = jwt.decode(accessToken);

      expect(decoded.userId).toBe("user-123");
      expect(decoded.role).toBe("product_manager");
    });

    test("Refresh token contains userId only", () => {
      const { refreshToken } = authService.generateTokens("user-456", "user");
      const decoded = jwt.decode(refreshToken);

      expect(decoded.userId).toBe("user-456");
      expect(decoded.role).toBeUndefined();
    });
  });

  describe("verifyAccessToken", () => {
    test("Returns decoded payload for valid token", () => {
      const { accessToken } = authService.generateTokens("user-1", "user");
      const decoded = authService.verifyAccessToken(accessToken);

      expect(decoded.userId).toBe("user-1");
      expect(decoded.role).toBe("user");
    });

    test("Throws error for invalid token", () => {
      expect(() => authService.verifyAccessToken("invalid-token")).toThrow();
    });

    test("Throws error for expired token", () => {
      const expiredToken = jwt.sign(
        { userId: "user-1", role: "user" },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "-1s" }
      );

      expect(() => authService.verifyAccessToken(expiredToken)).toThrow();
    });
  });

  describe("verifyRefreshToken", () => {
    test("Returns decoded payload for valid refresh token", () => {
      const { refreshToken } = authService.generateTokens("user-2", "admin");
      const decoded = authService.verifyRefreshToken(refreshToken);

      expect(decoded.userId).toBe("user-2");
    });

    test("Throws error for invalid refresh token", () => {
      expect(() => authService.verifyRefreshToken("bad-token")).toThrow();
    });
  });

  describe("storeRefreshToken", () => {
    test("Adds refresh token to user with expiry", async () => {
      const user = await User.create({
        name: "Test User",
        email: "store@test.com",
        password: "hashed123",
      });

      await authService.storeRefreshToken(user.userId, "token-abc");

      const updatedUser = await User.findOne({ userId: user.userId });
      expect(updatedUser.refreshTokens).toHaveLength(1);
      expect(updatedUser.refreshTokens[0].token).toBe("token-abc");
      expect(updatedUser.refreshTokens[0].expiresAt).toBeInstanceOf(Date);
    });

    test("Appends to existing refresh tokens array", async () => {
      const user = await User.create({
        name: "Multi Token",
        email: "multi@test.com",
        password: "hashed123",
      });

      await authService.storeRefreshToken(user.userId, "token-1");
      await authService.storeRefreshToken(user.userId, "token-2");

      const updatedUser = await User.findOne({ userId: user.userId });
      expect(updatedUser.refreshTokens).toHaveLength(2);
    });
  });

  describe("removeRefreshToken", () => {
    test("Removes specific refresh token from user", async () => {
      const user = await User.create({
        name: "Remove Test",
        email: "remove@test.com",
        password: "hashed123",
        refreshTokens: [
          { token: "token-1", expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
          { token: "token-2", expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
        ],
      });

      await authService.removeRefreshToken(user.userId, "token-1");

      const updatedUser = await User.findOne({ userId: user.userId });
      expect(updatedUser.refreshTokens).toHaveLength(1);
      expect(updatedUser.refreshTokens[0].token).toBe("token-2");
    });
  });

  describe("findUserByRefreshToken", () => {
    test("Finds user with valid non-expired refresh token", async () => {
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const user = await User.create({
        name: "Find Test",
        email: "find@test.com",
        password: "hashed123",
        refreshTokens: [{ token: "valid-token", expiresAt: futureDate }],
      });

      const found = await authService.findUserByRefreshToken("valid-token");

      expect(found).not.toBeNull();
      expect(found.userId).toBe(user.userId);
    });

    test("Returns null for expired refresh token", async () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      await User.create({
        name: "Expired Test",
        email: "expired@test.com",
        password: "hashed123",
        refreshTokens: [{ token: "expired-token", expiresAt: pastDate }],
      });

      const found = await authService.findUserByRefreshToken("expired-token");

      expect(found).toBeNull();
    });

    test("Returns null for non-existent token", async () => {
      const found = await authService.findUserByRefreshToken("does-not-exist");

      expect(found).toBeNull();
    });
  });

  describe("rotateRefreshToken", () => {
    test("Returns new token pair and rotates the token", async () => {
      const user = await User.create({
        name: "Rotate Test",
        email: "rotate@test.com",
        password: "hashed123",
        role: "admin",
      });

      const { refreshToken } = authService.generateTokens(user.userId, "admin");
      await authService.storeRefreshToken(user.userId, refreshToken);

      const result = await authService.rotateRefreshToken(refreshToken);

      expect(result).not.toBeNull();
      expect(result.userId).toBe(user.userId);
      expect(result.role).toBe("admin");
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();

      const updatedUser = await User.findOne({ userId: user.userId });
      expect(updatedUser.refreshTokens).toHaveLength(1);

      const decodedNew = jwt.decode(result.refreshToken);
      expect(decodedNew.userId).toBe(user.userId);
    });

    test("Returns null for invalid token", async () => {
      const result = await authService.rotateRefreshToken("invalid-token");

      expect(result).toBeNull();
    });

    test("Returns null for expired token", async () => {
      const user = await User.create({
        name: "Expire Rotate",
        email: "expire-rotate@test.com",
        password: "hashed123",
        role: "user",
      });

      const expiredToken = jwt.sign(
        { userId: user.userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "-1s" }
      );
      const expiresAt = new Date(Date.now() - 24 * 60 * 60 * 1000);
      await User.updateOne(
        { userId: user.userId },
        { $push: { refreshTokens: { token: expiredToken, expiresAt } } }
      );

      const result = await authService.rotateRefreshToken(expiredToken);

      expect(result).toBeNull();
    });
  });
});
