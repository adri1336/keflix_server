const router = require("express").Router();
const GenreController = require("../controller/Genre");

//MIDDLEWARE
const { protectedMiddleware } = require("./middleware");
router.use(protectedMiddleware);

router.post("/", async (req, res) => {
    try {
        const account = req.account;
        if(!account.admin) throw "invalid account";
        
        const genre = await GenreController.create(req.body);
        res.json(genre);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.get("/", async (req, res) => {
    try {
        const account = req.account;
        if(!account.admin) throw "invalid account";
        
        const genres = await GenreController.getAll();
        res.json(genres);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.put("/:genreId", async (req, res) => {
    try {
        const
            account = req.account,
            { genreId } = req.params;

        if(!account.admin) throw "invalid account";            

        let genre = await GenreController.get({ id: genreId });
        if(!genre) throw "invalid genre id";

        genre = await GenreController.update(genre, req.body);
        res.json(genre);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

router.delete("/:genreId", async (req, res) => {
    try {
        const
            account = req.account,
            { genreId } = req.params;

        if(!account.admin) throw "invalid account";
        
        const data = await GenreController.destroy({ id: genreId });
        if(!data) throw "invalid id";
        res.json(true);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

module.exports = router;