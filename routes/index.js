const router = require("express").Router();

const AuthRouter = require("./Auth");
const AccountRouter = require("./Account");
const ProfileRouter = require("./Profile");
const LibraryMovieRouter = require("./LibraryMovie");
const MovieRouter = require("./Movie");
const ProfileLibraryMovie = require("./ProfileLibraryMovie");

router.use("/auth", AuthRouter);
router.use("/account", AccountRouter);
router.use("/profile", ProfileRouter);
router.use("/library_movie", LibraryMovieRouter);
router.use("/movie", MovieRouter);
router.use("/profile_library_movie", ProfileLibraryMovie);

module.exports = router;