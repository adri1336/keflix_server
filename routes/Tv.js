require("dotenv").config();
const router = require("express").Router();
const fs = require("fs");
const TvController = require("../controller/Tv");
const EpisodeTvController = require("../controller/EpisodeTv");

//MIDDLEWARE
const { middleware, protectedMiddleware, verifyToken, verifyAccount } = require("./middleware");
const EpisodeTv = require("../controller/EpisodeTv");
router.use(middleware);

router.get("/:tvId/trailer.mp4", async (req, res) => {
    try {
        const token = req.query.token;
        verifyToken(token, async (error, decoded) => {
            try {
                if(error) throw "invalid token";
                if(await verifyAccount(decoded)) {
                    const tvId = req.params.tvId;
                    const file = process.env.MEDIA_PATH + "/tv/" + tvId + "/trailer.mp4";
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

router.get("/:tvId/:season/:episode/video.mp4", async (req, res) => {
    try {
        const token = req.query.token;
        verifyToken(token, async (error, decoded) => {
            try {
                if(error) throw "invalid token";
                if(await verifyAccount(decoded)) {
                    const { tvId, season, episode } = req.params;
                    const file = process.env.MEDIA_PATH + "/tv/" + tvId + "/" + season + "/" + episode + "/video.mp4";
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

router.get("/:tvId/:season/:episode/backdrop.png", async (req, res) => {
    try {
        const token = req.query.token;
        verifyToken(token, async (error, decoded) => {
            try {
                if(error) throw "invalid token";
                if(await verifyAccount(decoded)) {
                    const tvId = req.params.tvId;
                    const file = process.env.MEDIA_PATH + "/tv/" + tvId + "/" + season + "/" + episode + "/backdrop.png";
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

router.get("/:tvId/poster.png", async (req, res) => {
    try {
        const token = req.query.token;
        verifyToken(token, async (error, decoded) => {
            try {
                if(error) throw "invalid token";
                if(await verifyAccount(decoded)) {
                    const tvId = req.params.tvId;
                    const file = process.env.MEDIA_PATH + "/tv/" + tvId + "/poster.png";
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

router.get("/:tvId/backdrop.png", async (req, res) => {
    try {
        const token = req.query.token;
        verifyToken(token, async (error, decoded) => {
            try {
                if(error) throw "invalid token";
                if(await verifyAccount(decoded)) {
                    const tvId = req.params.tvId;
                    const file = process.env.MEDIA_PATH + "/tv/" + tvId + "/backdrop.png";
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

router.get("/:tvId/logo.png", async (req, res) => {
    try {
        const token = req.query.token;
        verifyToken(token, async (error, decoded) => {
            try {
                if(error) throw "invalid token";
                if(await verifyAccount(decoded)) {
                    const tvId = req.params.tvId;
                    const file = process.env.MEDIA_PATH + "/tv/" + tvId + "/logo.png";
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

        const tv = await TvController.create(req.body);
        res.json(tv);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.post("/:tvId/upload", async (req, res) => {
    try {
        const
            account = req.account,
            { tvId } = req.params,
            { fileName } = req.body;

        if(!account.admin) {
            throw "invalid account";
        }
        if(!req.files || Object.keys(req.files).length === 0) {
            throw "no file";
        }

        let path = process.env.MEDIA_PATH + "/tv/" + tvId + "/";
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

router.post("/:tvId/remove", async (req, res) => {
    try {
        const
            account = req.account,
            { tvId } = req.params,
            { fileName } = req.body;

        if(!account.admin) throw "invalid account";
        
        let file = process.env.MEDIA_PATH + "/tv/" + tvId + "/" + fileName;
        if(!fs.existsSync(file)) throw "invalid file";

        await fs.promises.unlink(file);
        res.json(true);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.put("/:tvId", async (req, res) => {
    try {
        const
            account = req.account,
            { tvId } = req.params;

        if(!account.admin) throw "invalid account";

        const targetTv = await TvController.get({ id: tvId });
        const { id } = await TvController.update(targetTv, req.body);

        const newTv = await TvController.getTv(id);
        res.json(newTv);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.put("/:tvId/genres", async (req, res) => {
    try {
        const
            account = req.account,
            { tvId } = req.params;

        if(!account.admin) throw "invalid account";

        const targetTv = await TvController.get({ id: tvId });
        const { id } = await TvController.updateGenres(targetTv, req.body);

        const newTv = await TvController.getTv(id);
        res.json(newTv);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.get("/", async (req, res) => {
    try {
        const account = req.account;    
        if(!account.admin) throw "invalid account";

        const tvs = await TvController.getTvs({
            include_adult: true,
            include_no_published: true,
            limit: -1
        });
        res.json(tvs);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.get("/:tvId", async (req, res) => {
    try {
        const account = req.account;    
        if(!account.admin) throw "invalid account";

        const { tvId } = req.params;
        const tv = await TvController.getTv(tvId);
        res.json(tv);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.post("/discover", async (req, res) => {
    try {
        const tvs = await TvController.getTvs({
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
        res.json(tvs);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.delete("/:tvId", async (req, res) => {
    try {
        const
            account = req.account,
            { tvId } = req.params;

        if(!account.admin) throw "invalid account";
        
        const data = await TvController.destroy(tvId);
        if(!data) throw "invalid id";
        res.json(true);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.delete("/:tvId/:season/:episode", async (req, res) => {
    try {
        const
            account = req.account,
            { tvId, season, episode } = req.params;

        if(!account.admin) throw "invalid account";
        
        const data = await EpisodeTvController.destroy(tvId, season, episode);
        if(!data) throw "invalid id";
        res.json(true);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.post("/:tvId/:season/:episode", async (req, res) => {
    try {
        const
            account = req.account,
            { tvId, season, episode } = req.params;
            
        if(!account.admin) throw "invalid account";
        req.body.accountId = account.id;
        req.body.tvId = tvId;
        req.body.season = season;
        req.body.episode = episode;

        const theEpisode = await EpisodeTvController.create(req.body);
        res.json(theEpisode);
    }
    catch(error) {
        console.log(error);
        res.status(400).json(error);
    }
});

router.post("/:tvId/:season/:episode/upload", async (req, res) => {
    try {
        const
            account = req.account,
            { tvId, season, episode } = req.params,
            { fileName } = req.body;

        if(!account.admin) {
            throw "invalid account";
        }
        if(!req.files || Object.keys(req.files).length === 0) {
            throw "no file";
        }

        let path = process.env.MEDIA_PATH + "/tv/" + tvId + "/" + season + "/" + episode + "/";
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

module.exports = router;