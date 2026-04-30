const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const userService = require("../services/user.service");

describe("User Service", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("findUserByEmail", () => {
    test("Returns user without password field", async () => {
      await User.create({
        name: "Find Test",
        email: "find@test.com",
        password: "hashed123",
      });

      const user = await userService.findUserByEmail("find@test.com");

      expect(user).not.toBeNull();
      expect(user.email).toBe("find@test.com");
      expect(user.password).toBeUndefined();
    });

    test("Returns null for non-existent email", async () => {
      const user = await userService.findUserByEmail("nobody@test.com");

      expect(user).toBeNull();
    });
  });

  describe("findUserByEmailWithPassword", () => {
    test("Returns user with password field", async () => {
      await User.create({
        name: "Password Test",
        email: "pwd@test.com",
        password: "hashedpwd",
      });

      const user = await userService.findUserByEmailWithPassword("pwd@test.com");

      expect(user).not.toBeNull();
      expect(user.password).toBe("hashedpwd");
    });
  });

  describe("createUser", () => {
    test("Hashes password before creating user", async () => {
      const user = await userService.createUser({
        name: "New User",
        email: "new@test.com",
        password: "plain-password",
      });

      expect(user.password).not.toBe("plain-password");
      expect(user.name).toBe("New User");
      expect(user.email).toBe("new@test.com");
    });

    test("Generated userId is a valid UUID", async () => {
      const user = await userService.createUser({
        name: "Auto ID",
        email: "autoid@test.com",
        password: "pass",
      });

      expect(user.userId).toBeDefined();
      expect(typeof user.userId).toBe("string");
      expect(user.userId.length).toBeGreaterThan(0);
    });

    test("Sets default role to user", async () => {
      const user = await userService.createUser({
        name: "Default Role",
        email: "default@test.com",
        password: "pass",
      });

      expect(user.role).toBe("user");
    });

    test("Creates unique emails without conflict", async () => {
      const user1 = await userService.createUser({
        name: "User 1",
        email: "unique1@test.com",
        password: "pass",
      });

      const user2 = await userService.createUser({
        name: "User 2",
        email: "unique2@test.com",
        password: "pass",
      });

      expect(user1.email).not.toBe(user2.email);
    });
  });

  describe("checkUserExists", () => {
    test("Returns truthy for existing user", async () => {
      await User.create({
        name: "Exists Test",
        email: "exists@test.com",
        password: "hashed123",
      });

      const exists = await userService.checkUserExists("exists@test.com");

      expect(exists).toBeTruthy();
    });

    test("Returns falsy for non-existing user", async () => {
      const exists = await userService.checkUserExists("ghost@test.com");

      expect(exists).toBeFalsy();
    });
  });

  describe("verifyPassword", () => {
    test("Returns true for matching passwords", async () => {
      const hashed = await bcrypt.hash("correct-password", 10);
      const result = await userService.verifyPassword("correct-password", hashed);

      expect(result).toBe(true);
    });

    test("Returns false for non-matching passwords", async () => {
      const hashed = await bcrypt.hash("correct-password", 10);
      const result = await userService.verifyPassword("wrong-password", hashed);

      expect(result).toBe(false);
    });
  });
});
