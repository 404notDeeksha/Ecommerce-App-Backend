const User = require("../models/User.model.js");
const bcrypt = require("bcryptjs");

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const findUserByEmailWithPassword = async (email) => {
  return await User.findOne({ email }).select("+password");
};

const createUser = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await User.create({
    name,
    email,
    password: hashedPassword,
  });
};

const checkUserExists = async (email) => {
  return await User.exists({ email });
};

const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  findUserByEmail,
  findUserByEmailWithPassword,
  createUser,
  checkUserExists,
  verifyPassword,
};