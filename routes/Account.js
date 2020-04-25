const router = require("express").Router();
const Account = require("../controller/Account");
const jwt = require("jsonwebtoken");
const { secretKey, tokenExpiresIn } = require("../config");

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const
            { email, password } = req.body,
            account = await Account.get({ email: email });
            
        if(!account) throw "invalid account";
        if(!await Account.checkPassword(password, account.password)) throw "invalid password";

        jwt.sign({ account: account }, secretKey, { expiresIn: tokenExpiresIn }, (error, token) => {
            if(error) throw error;
            res.json({ account, token });
        });
    }
    catch(error) {
        res.status(400).json(error);
    }
});

//REGISTER
router.post("/", async (req, res) => {
    try {
        const password = req.body.password;
        const hashedPassword = await Account.hashPassword(password);
        req.body.password = hashedPassword;
        const account = await Account.create(req.body);
        jwt.sign({ account: account }, secretKey, { expiresIn: tokenExpiresIn }, (error, token) => {
            if(error) throw error;
            res.json({ account, token });
        });
    }
    catch(error) {
        res.status(400).json(error);
    }
});

//MIDDLEWARE
const { middlewareRouter } = require("./middleware");
router.use(middlewareRouter);

//CRUD
router.get("/", async (req, res) => {
    try {
        const data = await Account.getAll();
        res.json(data);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const data = await Account.get({ id: req.params.id });
        if(!data) throw "invalid id";
        res.json(data);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.put("/:id", async (req, res) => {
    try {
        const data = await Account.update(req.body, { id: req.params.id });
        if(!data[0]) throw "invalid id";
        res.json(true);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const data = await Account.destroy({ id: req.params.id });
        if(!data) throw "invalid id";
        res.json(true);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

module.exports = router;