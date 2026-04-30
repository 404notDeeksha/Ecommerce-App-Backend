const errorHandler = require("../middlewares/errorHandler");

describe("Error Handler Middleware", () => {
  let req, res, next;
  let consoleErrorSpy;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test("Returns 500 and generic message in production", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    const err = new Error("Database connection failed");

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Something went wrong",
    });
    process.env.NODE_ENV = originalEnv;
  });

  test("Returns 500 and actual error message in development", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    const err = new Error("Database connection failed");

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Database connection failed",
    });
    process.env.NODE_ENV = originalEnv;
  });

  test("Uses err.statusCode if provided", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    const err = new Error("Product not found");
    err.statusCode = 404;

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Product not found",
    });
    process.env.NODE_ENV = originalEnv;
  });

  test("Logs error stack to console", () => {
    const err = new Error("Test error");
    err.stack = "Error: Test error\n  at test.js:1:1";

    errorHandler(err, req, res, next);

    expect(consoleErrorSpy).toHaveBeenCalledWith(err.stack);
  });

  test("Defaults to 500 when no statusCode on error", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    const err = new Error("Unknown error");

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    process.env.NODE_ENV = originalEnv;
  });

  test("Handles custom status codes correctly", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    const err = new Error("Unauthorized");
    err.statusCode = 401;

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Unauthorized",
    });
    process.env.NODE_ENV = originalEnv;
  });
});
