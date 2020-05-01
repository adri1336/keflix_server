require("dotenv").config();
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const { Sequelize, Op } = require("sequelize");
const AccountController = require("../controller/AccountController");
const MovieController = require("../controller/MovieController");
const ProfileLibraryMovieController = require("../controller/ProfileLibraryMovieController");

const MEDIA_MOVIES_PATH = path.join(__dirname, "../media/movies/");

const verifyToken = (token, callback) => {
    if(!token) res.sendStatus(403);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, callback);
};

const verifyAccount = async (decoded) => {
    const { accountId, updatedAt } = decoded;
    const account = await AccountController.get({ id: accountId });
    if(!account || account.updatedAt.getTime() != updatedAt) {
        return false;
    }
    return true;
};

router.get("/:idMovie/trailer.mp4", async (req, res) => {
    try {
        const token = req.query.token;
        verifyToken(token, async (error, decoded) => {
            if(error) return res.sendStatus(403);
            if(await verifyAccount(decoded)) {
                const idMovie = req.params.idMovie;
                const file = MEDIA_MOVIES_PATH + idMovie + "/trailer.mp4";
                if(fs.existsSync(file)) {
                    res.sendFile(file);
                }
                else {
                    res.json("file does not exists");
                }
            }
            else {
                res.sendStatus(403);
            }
        });
    }
    catch(error) {
        res.sendStatus(403);
    }
});

////VIDEO////

router.get("/:idMovie/poster.png", async (req, res) => {
    try {
        const token = req.query.token;
        verifyToken(token, async (error, decoded) => {
            if(error) return res.sendStatus(403);
            if(await verifyAccount(decoded)) {
                const idMovie = req.params.idMovie;
                const file = MEDIA_MOVIES_PATH + idMovie + "/poster.png";
                if(fs.existsSync(file)) {
                    res.sendFile(file);
                }
                else {
                    res.json("file does not exists");
                }
            }
            else {
                res.sendStatus(403);
            }
        });
    }
    catch(error) {
        res.sendStatus(403);
    }
});

router.get("/:idMovie/backdrop.png", async (req, res) => {
    try {
        const token = req.query.token;
        verifyToken(token, async (error, decoded) => {
            if(error) return res.sendStatus(403);
            if(await verifyAccount(decoded)) {
                const idMovie = req.params.idMovie;
                const file = MEDIA_MOVIES_PATH + idMovie + "/backdrop.png";
                if(fs.existsSync(file)) {
                    res.sendFile(file);
                }
                else {
                    res.json("file does not exists");
                }
            }
            else {
                res.sendStatus(403);
            }
        });
    }
    catch(error) {
        res.sendStatus(403);
    }
});

router.get("/:idMovie/logo.png", async (req, res) => {
    try {
        const token = req.query.token;
        verifyToken(token, async (error, decoded) => {
            if(error) return res.sendStatus(403);
            if(await verifyAccount(decoded)) {
                const idMovie = req.params.idMovie;
                const file = MEDIA_MOVIES_PATH + idMovie + "/logo.png";
                if(fs.existsSync(file)) {
                    res.sendFile(file);
                }
                else {
                    res.json("file does not exists");
                }
            }
            else {
                res.sendStatus(403);
            }
        });
    }
    catch(error) {
        res.sendStatus(403);
    }
});

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

        //mediaInfo
        for(let i = 0; i < final.length; i ++) {
            const movie = final[i];
            const mediaInfo = {
                trailer: fs.existsSync(MEDIA_MOVIES_PATH + movie.id + "/trailer.mp4"),
                video: fs.existsSync(MEDIA_MOVIES_PATH + movie.id + "/video.mp4"),
                poster: fs.existsSync(MEDIA_MOVIES_PATH + movie.id + "/poster.png"),
                backdrop: fs.existsSync(MEDIA_MOVIES_PATH + movie.id + "/backdrop.png"),
                logo: fs.existsSync(MEDIA_MOVIES_PATH + movie.id + "/logo.png")
            };
            final[i].dataValues.mediaInfo = mediaInfo;
        }

        res.json(final);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

module.exports = router;