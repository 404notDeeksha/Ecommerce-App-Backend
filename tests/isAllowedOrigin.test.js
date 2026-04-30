jest.mock("../config/envValidator", () => ({
  DEP_FRONTEND_URL: "https://myapp.vercel.app",
  DEV_FRONTEND_URL: "http://localhost:5173",
}));

const isAllowedOrigin = require("../utils/isAllowedOrigin");

describe("Is Allowed Origin", () => {
  test("Returns true for null origin", () => {
    expect(isAllowedOrigin(null)).toBe(true);
  });

  test("Returns true for undefined origin", () => {
    expect(isAllowedOrigin(undefined)).toBe(true);
  });

  test("Returns true for empty string origin", () => {
    expect(isAllowedOrigin("")).toBe(true);
  });

  test("Returns true for deployed frontend URL", () => {
    expect(isAllowedOrigin("https://myapp.vercel.app")).toBe(true);
  });

  test("Returns true for dev frontend URL", () => {
    expect(isAllowedOrigin("http://localhost:5173")).toBe(true);
  });

  test("Returns true for Vercel preview URL", () => {
    expect(isAllowedOrigin("https://abc123.vercel.app")).toBe(true);
    expect(isAllowedOrigin("https://my-project-xyz.vercel.app")).toBe(true);
  });

  test("Returns false for unknown origin", () => {
    expect(isAllowedOrigin("https://malicious-site.com")).toBe(false);
    expect(isAllowedOrigin("http://evil.com")).toBe(false);
  });

  test("Vercel preview regex allows hyphens and alphanumeric", () => {
    expect(isAllowedOrigin("https://a-b-c.vercel.app")).toBe(true);
    expect(isAllowedOrigin("https://123456.vercel.app")).toBe(true);
  });

  test("Rejects non-Vercel domains that look similar", () => {
    expect(isAllowedOrigin("https://fake.vercel.evil.com")).toBe(false);
    expect(isAllowedOrigin("https://notvercel.app")).toBe(false);
  });
});
