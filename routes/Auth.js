const router = require("express").Router();
const jwt = require("jsonwebtoken");
const AccountController = require("../controller/AccountController");
const AuthController = require("../controller/AuthController");

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        let account = await AccountController.validate(email, password);
    
        if(!account) throw "invalid account or password";
        account.password = undefined;
        
        const
            access_token = AuthController.generateAccessToken(account),
            refresh_token = AuthController.generateRefreshToken(account);
        res.json({ account, access_token, refresh_token });
    }
    catch(error) {
        res.status(400).json(error);
    }
});

//REGISTER
router.post("/register", async (req, res) => {
    try {
        let account = await AccountController.create(req.body);
        account.password = undefined;
        
        const
            access_token = AuthController.generateAccessToken(account),
            refresh_token = AuthController.generateRefreshToken(account);
        res.json({ account, access_token, refresh_token });
    }
    catch(error) {
        res.status(400).json(error);
    }
});

//REQUEST NEW TOKEN
router.post("/token", async (req, res) => {
    try {
        const { refresh_token } = req.body;
        if(!refresh_token) throw "invalid refresh token";

        const
            { id } = jwt.decode(refresh_token),
            account = await AccountController.get({ id: id });
        
        if(!account) throw "invalid refresh token";
        
        AuthController.verifyRefreshToken(account, refresh_token, (error) => {
            if(error) throw "invalid refresh token";

            const tokens = {
                token: AuthController.generateAccessToken(account),
                refresh_token: AuthController.generateRefreshToken(account)
            };
            if(!tokens) throw "invalid refresh token";
        
            res.json(tokens);
        });
    }
    catch(error) {
        res.status(400).json(error);
    }
});

module.exports = router;