const express = require("express");
const userRouter = express.Router();

const {
  signupUser,
  verifyPassword,
  verifyEmail,
  logoutUser,
} = require("../controllers/User.controller");

const validateRequest = require("../middlewares/validateRequest");
const { authLimiter, passwordAttemptLimiter } = require("../config/rateLimit");

const {
  signupSchema,
  emailAuthSchema,
  passwordAuthSchema,
} = require("../validations/user.schema");

userRouter.route("/signup").post(authLimiter, validateRequest(signupSchema), signupUser);
userRouter.route("/emailAuth").post(authLimiter, validateRequest(emailAuthSchema), verifyEmail);
userRouter
  .route("/passwordAuth")
  .post(passwordAttemptLimiter, validateRequest(passwordAuthSchema), verifyPassword);
userRouter.route("/logout").post(logoutUser);

module.exports = userRouter;
