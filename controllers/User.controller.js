const userService = require("../services/user.service");
const asyncHandler = require("../utils/asyncHandler.js");

const signupUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await userService.checkUserExists(email);
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }

  const user = await userService.createUser({ name, email, password });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      id: user.userId,
      name: user.name,
      email: user.email,
    },
  });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await userService.findUserByEmail(email);

  if (user) {
    return res.status(200).json({
      success: true,
      message: "User already registered. Go to sign-in page.",
      data: {
        id: user.userId,
        name: user.name,
        email: user.email,
      },
    });
  }
  return res.status(404).json({
    success: false,
    message: "User not registered. Please sign up.",
  });
});

const verifyPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.findUserByEmailWithPassword(email);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Email not found. User not registered",
    });
  }

  const isMatch = await userService.verifyPassword(password, user.password);

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      id: user.userId,
      name: user.name,
      email: user.email,
    },
  });
});

const logoutUser = (req, res) => {
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

module.exports = {
  signupUser,
  verifyEmail,
  verifyPassword,
  logoutUser,
};