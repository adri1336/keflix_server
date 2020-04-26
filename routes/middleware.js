require("dotenv").config();
const jwt = require("jsonwebtoken");

const middlewareRouter = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if(!token) throw "invalid token";

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
            if(error) throw "invalid token";
            
            req.token = decoded;  
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