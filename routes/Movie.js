const router = require("express").Router();
const { Sequelize, Op } = require("sequelize");
const MovieController = require("../controller/MovieController");
const ProfileLibraryMovieController = require("../controller/ProfileLibraryMovieController");

//MIDDLEWARE
const { middlewareRouter } = require("./middleware");
router.use(middlewareRouter);

router.post("/discover", async (req, res) => {
    try {
        const where = {
            adult: {
                [Op.or]: req.body.include_adult ? [true, false] : [false]
            },
            [Op.all]: req.body.year ? Sequelize.literal("YEAR(release_date) = " + req.body.year) : Sequelize.literal(""),
            published: {
                [Op.or]: req.body.include_no_published ? [true, false] : [true]
            }
        };
        console.log("where: ", where);

        let order = [["popularity", "DESC"]];
        if(req.body.sort_by) {
            order = [req.body.sort_by.split(".")];
        }
        console.log("order: ", order);

        const limit = req.body.limit || 50;
        const offset = req.body.page ? (req.body.limit * (req.body.page - 1)) : 0;
        const movies = await MovieController.getAll(where, order, limit, offset);

        //Genres Filter
        let final = [];
        const with_genres = req.body.with_genres ? req.body.with_genres.toString().split(",") : [];
        const without_genres = req.body.without_genres ? req.body.without_genres.toString().split(",") : [];
        if(with_genres.length > 0 || without_genres.length > 0) {
            movies.map(movie => {
                let add = with_genres.length == 0 ? true : false;
                for(let i = 0; i < movie.genres.length; i ++) {
                    const genre = movie.genres[i];
                    if(with_genres.some(id => genre.id.toString() == id)) {
                        add = true;
                    }
                    if(without_genres.some(id => genre.id.toString() == id)) {
                        add = false;
                        break;
                    }   
                }
                if(add) {
                    final.push(movie);
                }
            });
        }
        else {
            final = movies;
        }

        //Profile Info
        if(req.body.profile_id) {
            const profileId = req.body.profile_id;
            for(let i = 0; i < final.length; i ++) {
                const movie = final[i];
                const profileInfo = await ProfileLibraryMovieController.get({
                    libraryMovieId: movie.libraryMovieId,
                    profileId: profileId
                });
                if(profileInfo) {
                    final[i].dataValues.profileInfo = profileInfo.dataValues;
                }   
            }
        }

        res.json(final);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

module.exports = router;