const router = require("express").Router();
const AccountController = require("../controller/AccountController");
const AuthController = require("../controller/AuthController");

//MIDDLEWARE
const { middlewareRouter } = require("./middleware");
router.use(middlewareRouter);

//CRUD
router.get("/", async (req, res) => {
    try {
        const data = await AccountController.getAll();
        res.json(data);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const data = await AccountController.get({ id: req.params.id });
        if(!data) throw "invalid id";
        res.json(data);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.put("/:id", async (req, res) => {
    try {
        const data = await AccountController.update(req.body, { id: req.params.id });
        if(!data[0]) throw "invalid id";
        
        let id = req.params.id;
        if(req.body.id) id = req.body.id;

        const account = await AccountController.get({ id: id });
        if(!account) throw "error";

        const tokens = {
            token: AuthController.generateAccessToken(account),
            refresh_token: AuthController.generateRefreshToken(account)
        };
        if(!tokens) throw "error";

        res.json(tokens);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const data = await AccountController.destroy({ id: req.params.id });
        if(!data) throw "invalid id";
        res.json(true);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

module.exports = router;