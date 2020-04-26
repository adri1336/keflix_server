const router = require("express").Router();
const AccountController = require("../controller/AccountController");

//MIDDLEWARE
const { middlewareRouter } = require("./middleware");
router.use(middlewareRouter);

router.post("/check_password", async (req, res) => {
    try {
        const { password } = req.body;
        const account = await AccountController.get({ id: req.token.accountId });
        
        if(!account) throw "invalid account";
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