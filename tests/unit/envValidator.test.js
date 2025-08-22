describe("Environment variable validation", () => {
  let mockExit, mockError, mockLog;

  beforeEach(() => {
    jest.resetModules();
    mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});
    mockError = jest.spyOn(console, "error").mockImplementation(() => {});
    mockLog = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call process.exit if required env vars are missing", () => {
    process.env.NODE_ENV = "test";
    delete process.env.PORT;
    delete process.env.DEP_FRONTEND_URL;
    delete process.env.DEV_FRONTEND_URL;
    delete process.env.MONGODB_URL;

    const { validateEnvVars } = require("../../config/envValidator");
    validateEnvVars();

    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockError).toHaveBeenCalledWith(
      expect.stringContaining("🚨 Missing environment variables")
    );
  });

  it("should not call process.exit if all required env vars are present", () => {
    process.env.NODE_ENV = "test";
    process.env.PORT = "3000";
    process.env.DEP_FRONTEND_URL = "https://frontend.example.com";
    process.env.DEV_FRONTEND_URL = "http://localhost:3000";
    process.env.MONGODB_URL = "mongodb://localhost:27017/mydb";

    const { validateEnvVars } = require("../../config/envValidator");
    validateEnvVars();

    expect(mockExit).not.toHaveBeenCalled();
    expect(mockLog).not.toHaveBeenCalled();
  });
});
