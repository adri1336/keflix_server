const router = require("express").Router();
const jwt = require("jsonwebtoken");
const AccountController = require("../controller/AccountController");
const AuthController = require("../controller/AuthController");

//CON
router.get("/connection", (req, res) => res.sendStatus(200));

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        let account = await AccountController.get({ email: email });
        
        if(!account) throw "invalid account";
        if(!await AccountController.checkPassword(account, password)) throw "invalid password";
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
        account = await AccountController.get({ id: account.id }); //es nesario porque obtener la cuenta de la DB porque el valor de updatedAt que devuelve el metodo create no coincide con el de la DB (por milesimas)
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
            { accountId } = jwt.decode(refresh_token),
            account = await AccountController.get({ id: accountId });
        
        if(!account) throw "invalid refresh token";
        
        AuthController.verifyRefreshToken(account, refresh_token, (error) => {
            if(error) throw "invalid refresh token";

            const data = {
                account,
                access_token: AuthController.generateAccessToken(account),
                refresh_token: AuthController.generateRefreshToken(account)
            };
            res.json(data);
        });
    }
    catch(error) {
        res.status(400).json(error);
    }
});

module.exports = router;