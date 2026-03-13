const User = require("../models/User.model.js");
const bcrypt = require("bcryptjs");
const asyncHandler = require("../utils/asyncHandler.js");

// POST api/user/signup - create user account
const signupUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.exists({ email });
  if (existingUser)
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

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

// POST /api/user/emailAuth
const verifyEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

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

// POST  api/user/passwordAuth
const verifyPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Email not found. User not registered",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

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

// POST api/user/logout
const logoutUser = (req, res) => {
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

module.exports = {
  signupUser,
  verifyEmail,
  verifyPassword,
  logoutUser,
};
