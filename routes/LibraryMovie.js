const router = require("express").Router();
const LibraryMovieController = require("../controller/LibraryMovieController");
const AccountController = require("../controller/AccountController");

//MIDDLEWARE
const { middlewareRouter } = require("./middleware");
router.use(middlewareRouter);

router.post("/", async (req, res) => {
    try {
        const
            { accountId } = req.token,
            account = await AccountController.get({ id: accountId });

        if(!account || !account.admin) throw "invalid account";
        req.body.accountId = accountId;

        const libraryMovie = await LibraryMovieController.create(req.body);
        res.json(libraryMovie);
    }
    catch(error) {
        res.status(400).json(error);
    }
});

module.exports = router;