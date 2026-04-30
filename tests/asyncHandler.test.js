const asyncHandler = require("../utils/asyncHandler");

describe("Async Handler", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  test("Calls next with error when async function throws", async () => {
    const errorFn = async () => {
      throw new Error("Test error");
    };
    const wrapped = asyncHandler(errorFn);

    await wrapped(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error("Test error"));
  });

  test("Does not call next on successful async execution", async () => {
    const successFn = async () => {
      return "success";
    };
    const wrapped = asyncHandler(successFn);

    await wrapped(req, res, next);

    expect(next).not.toHaveBeenCalled();
  });

  test("Works with functions that use req, res, next", async () => {
    const fn = async (req, res, next) => {
      req.processed = true;
      next();
    };
    const wrapped = asyncHandler(fn);

    await wrapped(req, res, next);

    expect(req.processed).toBe(true);
  });

  test("Catches promise rejections and forwards to next", async () => {
    const rejectedFn = async () => {
      return Promise.reject(new Error("Rejected promise"));
    };
    const wrapped = asyncHandler(rejectedFn);

    await wrapped(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error("Rejected promise"));
  });
});
