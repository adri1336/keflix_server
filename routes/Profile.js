const router = require("express").Router();
const ProfileController = require("../controller/ProfileController");
const AccountController = require("../controller/AccountController");

//MIDDLEWARE
const { middlewareRouter } = require("./middleware");
router.use(middlewareRouter);

router.post("/", async (req, res) => {
    try {
        const account = req.account;
    
        req.body.accountId = account.id;
        
        let profile = await ProfileController.create(req.body);
        profile.password = undefined;
        res.json(profile);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.post("/:profileId/check_password", async (req, res) => {
    try {
        const
            account = req.account,
            { profileId } = req.params,
            profile = await ProfileController.get({ id: profileId });
        
        if(!profile || profile.accountId != account.id) throw "invalid profile id";

        const { password } = req.body;
        if(await ProfileController.checkPassword(profile, password)) {
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

router.get("/", async (req, res) => {
    try {
        const account = req.account;
        
        let profiles = await ProfileController.getAll({ accountId: account.id });
        profiles.forEach(profile => profile.password = undefined);
        res.json(profiles);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.put("/:profileId", async (req, res) => {
    try {
        const
            account = req.account,
            { profileId } = req.params,
            profile = await ProfileController.get({ id: profileId });
        
        if(!profile || profile.accountId != account.id) throw "invalid profile id";

        const data = await ProfileController.update(req.body, { id: profileId });
        if(!data[0]) throw "invalid id";
        res.json(true);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.delete("/:profileId", async (req, res) => {
    try {
        const
            account = req.account,
            { profileId } = req.params,
            profile = await ProfileController.get({ id: profileId });
        
        if(!profile || profile.accountId != account.id) throw "invalid profile id";

        const data = await ProfileController.destroy({ id: req.params.id });
        if(!data) throw "invalid id";
        res.json(true);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

module.exports = router;