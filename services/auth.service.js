const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const User = require("../models/User.model");

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { userId, role },
    jwtConfig.accessTokenSecret,
    { expiresIn: jwtConfig.accessTokenExpiry }
  );

  const refreshToken = jwt.sign(
    { userId },
    jwtConfig.refreshTokenSecret,
    { expiresIn: jwtConfig.refreshTokenExpiry }
  );

  return { accessToken, refreshToken };
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, jwtConfig.accessTokenSecret);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, jwtConfig.refreshTokenSecret);
};

const storeRefreshToken = async (userId, refreshToken) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await User.updateOne(
    { userId },
    {
      $push: {
        refreshTokens: { token: refreshToken, expiresAt }
      }
    },
    { upsert: true }
  );
};

const removeRefreshToken = async (userId, refreshToken) => {
  await User.updateOne(
    { userId },
    { $pull: { refreshTokens: { token: refreshToken } } }
  );
};

const removeAllRefreshTokens = async (userId) => {
  await User.updateOne(
    { userId },
    { $set: { refreshTokens: [] } }
  );
};

const findUserByRefreshToken = async (refreshToken) => {
  const user = await User.findOne({
    "refreshTokens.token": refreshToken,
    "refreshTokens.expiresAt": { $gt: new Date() }
  });

  return user;
};

const generateNewAccessToken = async (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);
  const user = await findUserByRefreshToken(refreshToken);

  if (!user || user.userId !== decoded.userId) {
    throw new Error("Invalid refresh token");
  }

  const { accessToken } = generateTokens(user.userId, user.role);

  return { accessToken, role: user.role };
};

const rotateRefreshToken = async (refreshToken) => {
  const user = await findUserByRefreshToken(refreshToken);

  if (!user) {
    return null;
  }

  await removeRefreshToken(user.userId, refreshToken);

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(
    user.userId,
    user.role
  );

  await storeRefreshToken(user.userId, newRefreshToken);

  return {
    userId: user.userId,
    role: user.role,
    accessToken,
    refreshToken: newRefreshToken,
  };
};

module.exports = {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  storeRefreshToken,
  removeRefreshToken,
  removeAllRefreshTokens,
  findUserByRefreshToken,
  generateNewAccessToken,
  rotateRefreshToken,
};
