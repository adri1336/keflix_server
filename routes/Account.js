const router = require("express").Router();
const AccountController = require("../controller/AccountController");

//MIDDLEWARE
const { middlewareRouter } = require("./middleware");
router.use(middlewareRouter);

router.get("/connection", (req, res) => res.sendStatus(200));

router.post("/check_password", async (req, res) => {
    try {
        const
            { password } = req.body,
            account = req.account;
            
        if(await AccountController.checkPassword(account, password)) {
            res.sendStatus(200);
        }
        else {
            res.sendStatus(403);
        }
    }
    catch(error) {
        res.status(400).json(error);
    }
});

module.exports = router;