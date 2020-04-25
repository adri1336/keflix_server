const jwt = require("jsonwebtoken");
const { secretKey, authHeader } = require("../config");

const middlewareRouter = (req, res, next) => {
    try {
        const token = req.headers[authHeader];
        jwt.verify(token, secretKey, (error, authData) => {      
            if(error) throw "invalid token";
            req.authData = authData;    
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