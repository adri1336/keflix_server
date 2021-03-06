require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateAccessToken = (account) => {
    return jwt.sign({ accountId: account.id, updatedAt: account.updatedAt.getTime() }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
};

const generateRefreshToken = (account) => {
    return jwt.sign({ accountId: account.id }, process.env.REFRESH_TOKEN_SECRET + account.updatedAt.getTime(), { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });
};

const verifyRefreshToken = (account, refresh_token, callback) => {
    jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET + account.updatedAt.getTime(), callback);
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
};