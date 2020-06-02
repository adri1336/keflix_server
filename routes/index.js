const router = require("express").Router();

const AuthRouter = require("./Auth");
const AccountRouter = require("./Account");
const ProfileRouter = require("./Profile");
const MovieRouter = require("./Movie");
const ProfileMovieRouter = require("./ProfileMovie");
const GenreRouter = require("./Genre");

router.use("/auth", AuthRouter);
router.use("/account", AccountRouter);
router.use("/profile", ProfileRouter);
router.use("/movie", MovieRouter);
router.use("/profile_movie", ProfileMovieRouter);
router.use("/genre", GenreRouter);

module.exports = router;