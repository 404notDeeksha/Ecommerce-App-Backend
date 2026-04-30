const {
  apiLimiter,
  authLimiter,
  passwordAttemptLimiter,
  refreshTokenLimiter,
} = require("../config/rateLimit");

describe("Rate Limit Configuration", () => {
  test("All four rate limiters are exported", () => {
    expect(apiLimiter).toBeDefined();
    expect(authLimiter).toBeDefined();
    expect(passwordAttemptLimiter).toBeDefined();
    expect(refreshTokenLimiter).toBeDefined();
  });

  test("All limiters are middleware functions", () => {
    expect(typeof apiLimiter).toBe("function");
    expect(typeof authLimiter).toBe("function");
    expect(typeof passwordAttemptLimiter).toBe("function");
    expect(typeof refreshTokenLimiter).toBe("function");
  });

  test("All limiters are distinct functions", () => {
    const limiters = [apiLimiter, authLimiter, passwordAttemptLimiter, refreshTokenLimiter];
    const unique = new Set(limiters);

    expect(unique.size).toBe(4);
  });
});
