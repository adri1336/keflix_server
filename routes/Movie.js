require("dotenv").config();
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const AccountController = require("../controller/AccountController");
const MovieController = require("../controller/MovieController");

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
                const file = process.env.MEDIA_MOVIES_PATH + idMovie + "/trailer.mp4";
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

router.get("/:idMovie/video.mp4", async (req, res) => {
    try {
        const token = req.query.token;
        verifyToken(token, async (error, decoded) => {
            if(error) return res.sendStatus(403);
            if(await verifyAccount(decoded)) {
                const idMovie = req.params.idMovie;
                const file = process.env.MEDIA_MOVIES_PATH + idMovie + "/video.mp4";
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

router.get("/:idMovie/poster.png", async (req, res) => {
    try {
        const token = req.query.token;
        verifyToken(token, async (error, decoded) => {
            if(error) return res.sendStatus(403);
            if(await verifyAccount(decoded)) {
                const idMovie = req.params.idMovie;
                const file = process.env.MEDIA_MOVIES_PATH + idMovie + "/poster.png";
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
                const file = process.env.MEDIA_MOVIES_PATH + idMovie + "/backdrop.png";
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
                const file = process.env.MEDIA_MOVIES_PATH + idMovie + "/logo.png";
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
        const movies = await MovieController.getMovies({
            search: req.body.search,
            include_adult: req.body.include_adult,
            year: req.body.year,
            include_no_published: req.body.include_no_published,
            sort_by: req.body.sort_by,
            limit: req.body.limit,
            page: req.body.page,
            with_genres: req.body.with_genres,
            without_genres: req.body.without_genres,
            profile_id: req.body.profile_id
        });
        res.json(movies);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

module.exports = router;