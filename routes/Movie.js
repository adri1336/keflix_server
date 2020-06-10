require("dotenv").config();
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const AccountController = require("../controller/Account");
const MovieController = require("../controller/Movie");

//MIDDLEWARE
const { middleware, protectedMiddleware } = require("./middleware");
router.use(middleware);

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

router.get("/:movieId/trailer.mp4", async (req, res) => {
    try {
        const token = req.query.token;
        verifyToken(token, async (error, decoded) => {
            try {
                if(error) throw "invalid token";
                if(await verifyAccount(decoded)) {
                    const movieId = req.params.movieId;
                    const file = process.env.MEDIA_PATH + "/movies/" + movieId + "/trailer.mp4";
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
            }
            catch(error) {
                res.sendStatus(403);
            }
        });
    }
    catch(error) {
        res.sendStatus(403);
    }
});

router.get("/:movieId/video.mp4", async (req, res) => {
    try {
        const token = req.query.token;
        verifyToken(token, async (error, decoded) => {
            try {
                if(error) throw "invalid token";
                if(await verifyAccount(decoded)) {
                    const movieId = req.params.movieId;
                    const file = process.env.MEDIA_PATH + "/movies/" + movieId + "/video.mp4";
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
            }
            catch(error) {
                res.sendStatus(403);
            }
        });
    }
    catch(error) {
        res.sendStatus(403);
    }
});

router.get("/:movieId/poster.png", async (req, res) => {
    try {
        const token = req.query.token;
        verifyToken(token, async (error, decoded) => {
            try {
                if(error) throw "invalid token";
                if(await verifyAccount(decoded)) {
                    const movieId = req.params.movieId;
                    const file = process.env.MEDIA_PATH + "/movies/" + movieId + "/poster.png";
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
            }
            catch(error) {
                res.sendStatus(403);
            }
        });
    }
    catch(error) {
        res.sendStatus(403);
    }
});

router.get("/:movieId/backdrop.png", async (req, res) => {
    try {
        const token = req.query.token;
        verifyToken(token, async (error, decoded) => {
            try {
                if(error) throw "invalid token";
                if(await verifyAccount(decoded)) {
                    const movieId = req.params.movieId;
                    const file = process.env.MEDIA_PATH + "/movies/" + movieId + "/backdrop.png";
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
            }
            catch(error) {
                res.sendStatus(403);
            }
        });
    }
    catch(error) {
        res.sendStatus(403);
    }
});

router.get("/:movieId/logo.png", async (req, res) => {
    try {
        const token = req.query.token;
        verifyToken(token, async (error, decoded) => {
            try {
                if(error) throw "invalid token";
                if(await verifyAccount(decoded)) {
                    const movieId = req.params.movieId;
                    const file = process.env.MEDIA_PATH + "/movies/" + movieId + "/logo.png";
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
            }
            catch(error) {
                res.sendStatus(403);
            }
        });
    }
    catch(error) {
        res.sendStatus(403);
    }
});

//MIDDLEWARE
router.use(protectedMiddleware);

router.post("/", async (req, res) => {
    try {
        const account = req.account;
            
        if(!account.admin) throw "invalid account";
        req.body.accountId = account.id;

        const movie = await MovieController.create(req.body);
        res.json(movie);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.post("/:movieId/upload", async (req, res) => {
    try {
        const
            account = req.account,
            { movieId } = req.params,
            { fileName } = req.body;

        if(!account.admin) {
            throw "invalid account";
        }
        if(!req.files || Object.keys(req.files).length === 0) {
            throw "no file";
        }

        const path = process.env.MEDIA_PATH + "/movies/" + movieId + "/";
        if(!fs.existsSync(path)) {
            await fs.promises.mkdir(path, { recursive: true });
        }

        const file = req.files.file;
        file.mv(path + (fileName || file.name), error => {
            if(error) {
                return res.sendStatus(500);
            }

            res.sendStatus(200);
        });
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.put("/:movieId", async (req, res) => {
    try {
        const
            account = req.account,
            { movieId } = req.params;

        if(!account.admin) throw "invalid account";

        const targetMovie = await MovieController.get({ id: movieId });
        const { id } = await MovieController.update(targetMovie, req.body);

        const newMovie = await MovieController.getMovie(id);
        res.json(newMovie);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.put("/:movieId/genres", async (req, res) => {
    try {
        const
            account = req.account,
            { movieId } = req.params;

        if(!account.admin) throw "invalid account";

        const targetMovie = await MovieController.get({ id: movieId });
        const { id } = await MovieController.updateGenres(targetMovie, req.body);

        const newMovie = await MovieController.getMovie(id);
        res.json(newMovie);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.get("/", async (req, res) => {
    try {
        const account = req.account;    
        if(!account.admin) throw "invalid account";

        const movies = await MovieController.getMovies({
            include_adult: true,
            include_no_published: true,
            limit: -1
        });
        res.json(movies);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

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

router.delete("/:movieId", async (req, res) => {
    try {
        const
            account = req.account,
            { movieId } = req.params;

        if(!account.admin) throw "invalid account";
        
        const data = await MovieController.destroy(movieId);
        if(!data) throw "invalid id";
        res.json(true);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

module.exports = router;