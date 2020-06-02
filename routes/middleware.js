require("dotenv").config();
const jwt = require("jsonwebtoken");
const AccountController = require("../controller/Account");

const middlewareRouter = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if(!token) res.sendStatus(403);

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, decoded) => {
            if(error) return res.sendStatus(403);

            const { accountId, updatedAt } = decoded;

            const account = await AccountController.get({ id: accountId });
            if(!account || account.updatedAt.getTime() != updatedAt) return res.sendStatus(403);
            
            req.account = account;  
            next();
        });
    }
    catch(error) {
        res.sendStatus(403);
    }
};

module.exports = {
    middlewareRouter
};