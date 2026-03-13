const express = require("express");
const userRouter = express.Router();

const {
  signupUser,
  verifyPassword,
  verifyEmail,
  logoutUser,
} = require("../controllers/User.controller");

const validateRequest = require("../middlewares/validateRequest");

const {
  signupSchema,
  emailAuthSchema,
  passwordAuthSchema,
} = require("../validations/user.schema");

userRouter.route("/signup").post(validateRequest(signupSchema), signupUser);
userRouter
  .route("/emailAuth")
  .post(validateRequest(emailAuthSchema), verifyEmail);
userRouter
  .route("/passwordAuth")
  .post(validateRequest(passwordAuthSchema), verifyPassword);
userRouter.route("/logout").post(logoutUser);

module.exports = userRouter;
