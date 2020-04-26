const router = require("express").Router();
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

module.exports = router;