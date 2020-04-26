require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateAccessToken = (account) => {
    return jwt.sign({ id: account.id, admin: account.admin, updatedAt: account.updatedAt }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
}

const generateRefreshToken = (account) => {
    return jwt.sign({ id: account.id, admin: account.admin, updatedAt: account.updatedAt }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });
}

module.exports = {
    generateAccessToken,
    generateRefreshToken
};