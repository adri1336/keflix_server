const router = require("express").Router();
const ProfileController = require("../controller/Profile");
const ProfileTvController = require("../controller/ProfileTv");
const TvController = require("../controller/Tv");

//MIDDLEWARE
const { protectedMiddleware } = require("./middleware");
router.use(protectedMiddleware);

router.post("/", async (req, res) => {
    try {
        const
            account = req.account,
            { profileId, tvId } = req.body,
            profile = await ProfileController.get({ id: profileId });
        
        if(!tvId || !profile || profile.accountId != account.id) throw "invalid profile id";

        await ProfileTvController.upsert(req.body);
        const result = await ProfileTvController.get({ profileId: profileId, tvId: tvId });
        res.json(result);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.get("/:profileId/favs", async (req, res) => {
    try {
        const
            account = req.account,
            { profileId } = req.params,
            profile = await ProfileController.get({ id: profileId });
        
        if(!profile || profile.accountId != account.id) throw "invalid profile id";

        let favs = [];
        const results = await ProfileTvController.getAll({ profileId: profileId, fav: true });
        for (let index = 0; index < results.length; index++) {
            const result = results[index];
            let tv = await TvController.getTv(result.tvId);
            if(tv) {
                if(profile.adult_content || !tv.adult) {
                    tv.dataValues.profileInfo = result;
                    tv.dataValues.mediaInfo = TvController.getTvMediaInfo(tv.id);
                    favs.push(tv);
                }
            }   
        }
        
        res.json(favs);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

module.exports = router;