const router = require("express").Router();
const AccountController = require("../controller/Account");

//MIDDLEWARE
const { middlewareRouter } = require("./middleware");
router.use(middlewareRouter);

router.get("/", (req, res) => {
    const account = req.account;
    res.json(account);
});

router.post("/check_password", async (req, res) => {
    try {
        const
            { password } = req.body,
            account = req.account;

        if(await AccountController.checkPassword(account, password)) {
            res.sendStatus(200);
        }
        else {
            res.sendStatus(400);
        }
    }
    catch(error) {
        res.status(400).json(error);
    }
});

module.exports = router;