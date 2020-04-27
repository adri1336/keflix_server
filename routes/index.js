const router = require("express").Router();

const AuthRouter = require("./Auth");
const AccountRouter = require("./Account");
const ProfileRouter = require("./Profile");
const LibraryMovieRouter = require("./LibraryMovie");

router.use("/auth", AuthRouter);
router.use("/account", AccountRouter);
router.use("/profile", ProfileRouter);
router.use("/library_movie", LibraryMovieRouter);

module.exports = router;