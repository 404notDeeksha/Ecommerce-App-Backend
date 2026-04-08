const { checkPermission, ROLES } = require("../middlewares/rbac.middleware");

console.log("=== RBAC Middleware Tests ===\n");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (e) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${e.message}`);
    failed++;
  }
}

function assertEqual(actual, expected, msg) {
  if (actual !== expected) {
    throw new Error(`${msg}: expected "${expected}", got "${actual}"`);
  }
}

function assertArrayContains(array, item, msg) {
  if (!array.includes(item)) {
    throw new Error(`${msg}: expected [${array}] to contain "${item}"`);
  }
}

console.log("--- ROLES Configuration ---\n");
test("Admin has all permissions", () => {
  assertArrayContains(ROLES.admin, "product:create", "admin");
  assertArrayContains(ROLES.admin, "product:read", "admin");
  assertArrayContains(ROLES.admin, "product:update", "admin");
  assertArrayContains(ROLES.admin, "product:delete", "admin");
});

test("product_manager has create, read, update", () => {
  assertArrayContains(ROLES.product_manager, "product:create", "pm");
  assertArrayContains(ROLES.product_manager, "product:read", "pm");
  assertArrayContains(ROLES.product_manager, "product:update", "pm");
});

test("user has read only", () => {
  assertArrayContains(ROLES.user, "product:read", "user");
});

console.log("\n--- checkPermission Middleware ---\n");

test("Returns 401 if no user", () => {
  const middleware = checkPermission("product:create");
  const req = {};
  const res = {
    status: function (code) {
      assertEqual(code, 401, "status");
      return this;
    },
    json: function (data) {
      assertEqual(data.success, false, "success");
      assertEqual(data.message, "Unauthorized. User not authenticated.", "message");
    },
  };
  middleware(req, res, () => {});
});

test("Returns 403 if role has no permissions", () => {
  const middleware = checkPermission("product:create");
  const req = { user: { role: "invalid_role" } };
  const res = {
    status: function (code) {
      assertEqual(code, 403, "status");
      return this;
    },
    json: function (data) {
      assertEqual(data.success, false, "success");
      assertEqual(data.message, "Access denied. Invalid role.", "message");
    },
  };
  middleware(req, res, () => {});
});

test("Returns 403 if permission denied", () => {
  const middleware = checkPermission("product:delete");
  const req = { user: { role: "product_manager" } };
  const res = {
    status: function (code) {
      assertEqual(code, 403, "status");
      return this;
    },
    json: function (data) {
      assertEqual(data.success, false, "success");
      assertEqual(data.message, "Access denied. Required permission: product:delete", "message");
    },
  };
  middleware(req, res, () => {});
});

test("Calls next() if permission granted", () => {
  const middleware = checkPermission("product:create");
  const req = { user: { role: "admin" } };
  let nextCalled = false;
  const res = {};
  middleware(req, res, () => {
    nextCalled = true;
  });
  if (!nextCalled) throw new Error("next() was not called");
});

test("Admin can delete products", () => {
  const middleware = checkPermission("product:delete");
  const req = { user: { role: "admin" } };
  let nextCalled = false;
  const res = {};
  middleware(req, res, () => {
    nextCalled = true;
  });
  if (!nextCalled) throw new Error("next() was not called for admin");
});

test("product_manager cannot delete products", () => {
  const middleware = checkPermission("product:delete");
  const req = { user: { role: "product_manager" } };
  let nextCalled = false;
  const res = {
    status: function (code) {
      assertEqual(code, 403, "status");
      return this;
    },
    json: function () {},
  };
  middleware(req, res, () => {
    nextCalled = true;
  });
  if (nextCalled) throw new Error("next() should not be called for product_manager");
});

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);

if (failed > 0) {
  process.exit(1);
}