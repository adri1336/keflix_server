require("dotenv").config();
const jwt = require("jsonwebtoken");
const AccountController = require("../controller/Account");

function setDefaultHeaders(res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Accept, Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
}

const middleware = (req, res, next) => {
    setDefaultHeaders(res);
    if(req.method == "OPTIONS") {
        res.sendStatus(200);
        return;
    }
    next();
};

const protectedMiddleware = (req, res, next) => {
    setDefaultHeaders(res);
    if(req.method == "OPTIONS") {
        res.sendStatus(200);
        return;
    }

    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if(!token) throw "invalid token";

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, decoded) => {
            try {
                if(error) throw "invalid token";

                const { accountId, updatedAt } = decoded;

                const account = await AccountController.get({ id: accountId });
                if(!account || account.updatedAt.getTime() != updatedAt) throw "invalid token";
                
                req.account = account;  
                next();
            }
            catch(error) {
                res.sendStatus(403);
            }
        });
    }
    catch(error) {
        res.sendStatus(403);
    }
};

const verifyToken = (token, callback) => {
    if(!token) res.sendStatus(403);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, callback);
};

const verifyAccount = async (decoded) => {
    const { accountId, updatedAt } = decoded;
    const account = await AccountController.get({ id: accountId });
    if(!account || account.updatedAt.getTime() != updatedAt) {
        return false;
    }
    return true;
};

module.exports = {
    middleware,
    protectedMiddleware,
    verifyToken,
    verifyAccount
};