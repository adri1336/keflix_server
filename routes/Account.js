const router = require("express").Router();
const AccountController = require("../controller/Account");

//MIDDLEWARE
const { protectedMiddleware } = require("./middleware");
router.use(protectedMiddleware);

router.post("/", async (req, res) => {
    try {
        const currentAccount = req.account;
        if(!currentAccount.admin) throw "invalid profile id";
        
        let account = await AccountController.create(req.body);
        account.password = undefined;
        account.profiles = [];

        res.json(account);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.put("/:accountId", async (req, res) => {
    try {
        const
            account = req.account,
            { accountId } = req.params;

        if(!account.admin) {
            if(account.id !== accountId) throw "invalid account";
        }

        let targetAccount = await AccountController.get({ id: accountId });
        targetAccount = await AccountController.update(targetAccount, req.body);
        res.json(targetAccount);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.get("/", (req, res) => {
    const account = req.account;
    res.json(account);
});

router.get("/list", async (req, res) => {
    try {
        const account = req.account;
        if(!account.admin) throw "invalid profile id";

        const data = await AccountController.getAll();
        res.json(data);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.delete("/:accountId", async (req, res) => {
    try {
        const
            account = req.account,
            { accountId } = req.params;
        
        if(!account.admin) {
            if(accountId != account.id) throw "invalid profile id";
        }

        const data = await AccountController.destroy({ id: accountId });
        if(!data) throw "invalid id";
        res.json(true);
    }
    catch(error) {
        res.status(400).json(error);
    }
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