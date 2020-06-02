const router = require("express").Router();
const ProfileController = require("../controller/Profile");
const ProfileMovieController = require("../controller/ProfileMovie");
const MovieController = require("../controller/Movie");

//MIDDLEWARE
const { middlewareRouter } = require("./middleware");
router.use(middlewareRouter);

router.post("/", async (req, res) => {
    try {
        const
            account = req.account,
            { profileId, movieId } = req.body,
            profile = await ProfileController.get({ id: profileId });
        
        if(!movieId || !profile || profile.accountId != account.id) throw "invalid profile id";

        await ProfileMovieController.upsert(req.body);
        const result = await ProfileMovieController.get({ profileId: profileId, movieId: movieId });
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
        const results = await ProfileMovieController.getAll({ profileId: profileId, fav: true });
        for (let index = 0; index < results.length; index++) {
            const result = results[index];
            let movie = await MovieController.get({ movieId: result.movieId });
            if(movie) {
                if(profile.adult_content || !movie.adult) {
                    movie.dataValues.profileInfo = result;
                    movie.dataValues.mediaInfo = MovieController.getMovieMediaInfo(movie.id);
                    favs.push(movie);
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