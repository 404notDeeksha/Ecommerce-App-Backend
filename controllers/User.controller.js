const User = require("../models/User.model.js");
const bcrypt = require("bcryptjs");

// POST api/user/signup - create user account
const signupUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

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
const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(200).json({
        success: true,
        message: "User already registered. Go to sign-in page.",
        data: user,
      });
    }

    return res.status(404).json({
      success: false,
      message: "User not registered. Please sign up.",
    });
  } catch (err) {
    console.error("Error in verifyEmail:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// POST  api/user/passwordAuth
const verifyPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ error: "Email not found. User not registered" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });

    res.status(201).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.userId,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// POST api/user/logout
const logoutUser = (req, res) => {
  try {
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  signupUser,
  verifyEmail,
  verifyPassword,
  logoutUser,
};
