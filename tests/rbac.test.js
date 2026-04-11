const { checkPermission, ROLES } = require("../middlewares/rbac.middleware");

describe("RBAC Middleware", () => {
  describe("ROLES Configuration", () => {
    test("Admin has all permissions", () => {
      expect(ROLES.admin).toContain("product:create");
      expect(ROLES.admin).toContain("product:read");
      expect(ROLES.admin).toContain("product:update");
      expect(ROLES.admin).toContain("product:delete");
    });

    test("product_manager has create, read, update", () => {
      expect(ROLES.product_manager).toContain("product:create");
      expect(ROLES.product_manager).toContain("product:read");
      expect(ROLES.product_manager).toContain("product:update");
      expect(ROLES.product_manager).not.toContain("product:delete");
    });

    test("user has read only", () => {
      expect(ROLES.user).toContain("product:read");
      expect(ROLES.user).not.toContain("product:create");
      expect(ROLES.user).not.toContain("product:update");
      expect(ROLES.user).not.toContain("product:delete");
    });
  });

  describe("checkPermission Middleware", () => {
    test("Returns 401 if no user", () => {
      const middleware = checkPermission("product:create");
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Unauthorized. User not authenticated.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("Returns 403 if role is invalid", () => {
      const middleware = checkPermission("product:create");
      const req = { user: { role: "invalid_role" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Access denied. Invalid role.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("Returns 403 if permission denied", () => {
      const middleware = checkPermission("product:delete");
      const req = { user: { role: "product_manager" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Access denied. Required permission: product:delete",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("Calls next() if permission granted", () => {
      const middleware = checkPermission("product:create");
      const req = { user: { role: "admin" } };
      const res = {};
      const next = jest.fn();

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test("Admin can delete products", () => {
      const middleware = checkPermission("product:delete");
      const req = { user: { role: "admin" } };
      const res = {};
      const next = jest.fn();

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test("product_manager cannot delete products", () => {
      const middleware = checkPermission("product:delete");
      const req = { user: { role: "product_manager" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
