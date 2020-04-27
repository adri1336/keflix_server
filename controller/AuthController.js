require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateAccessToken = (account) => {
    return jwt.sign({ accountId: account.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
};

const generateRefreshToken = (account) => {
    return jwt.sign({ accountId: account.id }, process.env.REFRESH_TOKEN_SECRET + account.updatedAt, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });
};

const verifyRefreshToken = (account, refresh_token, callback) => {
    jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET + account.updatedAt, callback);
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
};