const router = require("express").Router();
const ProfileController = require("../controller/ProfileController");
const ProfileLibraryMovieController = require("../controller/ProfileLibraryMovieController");

//MIDDLEWARE
const { middlewareRouter } = require("./middleware");
router.use(middlewareRouter);

router.post("/", async (req, res) => {
    try {
        const
            account = req.account,
            { profileId, libraryMovieId } = req.body,
            profile = await ProfileController.get({ id: profileId });
        
        if(!libraryMovieId || !profile || profile.accountId != account.id) throw "invalid profile id";

        await ProfileLibraryMovieController.upsert(req.body);
        const result = await ProfileLibraryMovieController.get({ profileId: profileId, libraryMovieId: libraryMovieId });
        res.json(result);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

module.exports = router;