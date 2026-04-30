const validateRequest = require("../middlewares/validateRequest");
const { z } = require("zod");

describe("Validate Request Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test("Calls next() when validation passes", () => {
    const schema = z.object({
      body: z.object({ name: z.string() }),
      params: z.object({}),
      query: z.object({}),
    });
    req.body = { name: "test" };
    const middleware = validateRequest(schema);

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test("Returns 400 with structured errors when validation fails", () => {
    const schema = z.object({
      body: z.object({ email: z.string().email() }),
      params: z.object({}),
      query: z.object({}),
    });
    req.body = { email: "not-an-email" };
    const middleware = validateRequest(schema);

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Validation failed",
      errors: expect.arrayContaining([
        expect.objectContaining({
          field: expect.stringContaining("email"),
          message: expect.any(String),
        }),
      ]),
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("Validates params correctly", () => {
    const schema = z.object({
      body: z.object({}),
      params: z.object({ id: z.string().min(1) }),
      query: z.object({}),
    });
    req.params = { id: "" };
    const middleware = validateRequest(schema);

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Validation failed",
      })
    );
  });

  test("Validates query parameters correctly", () => {
    const schema = z.object({
      body: z.object({}),
      params: z.object({}),
      query: z.object({ page: z.string().transform(Number).refine((n) => n > 0) }),
    });
    req.query = { page: "0" };
    const middleware = validateRequest(schema);

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test("Error format includes field path and message", () => {
    const schema = z.object({
      body: z.object({
        name: z.string().min(2),
        email: z.string().email(),
      }),
      params: z.object({}),
      query: z.object({}),
    });
    req.body = { name: "a", email: "invalid" };
    const middleware = validateRequest(schema);

    middleware(req, res, next);

    const response = res.json.mock.calls[0][0];
    expect(response.errors.length).toBeGreaterThan(0);
    expect(response.errors[0]).toHaveProperty("field");
    expect(response.errors[0]).toHaveProperty("message");
  });

  test("Handles empty body when required fields are missing", () => {
    const schema = z.object({
      body: z.object({ requiredField: z.string() }),
      params: z.object({}),
      query: z.object({}),
    });
    const middleware = validateRequest(schema);

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test("Allows valid nested objects", () => {
    const schema = z.object({
      body: z.object({
        user: z.object({ name: z.string(), age: z.number() }),
      }),
      params: z.object({}),
      query: z.object({}),
    });
    req.body = { user: { name: "John", age: 25 } };
    const middleware = validateRequest(schema);

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
