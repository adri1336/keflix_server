const router = require("express").Router();

const AuthRouter = require("./Auth");
const AccountRouter = require("./Account");
const ProfileRouter = require("./Profile");
const MovieRouter = require("./Movie");
const ProfileMovieRouter = require("./ProfileMovie");
const GenreRouter = require("./Genre");
const InfoRouter = require("./Info");
const TvRouter = require("./Tv");
const ProfileTvRouter = require("./ProfileTv");

router.use("/auth", AuthRouter);
router.use("/account", AccountRouter);
router.use("/profile", ProfileRouter);
router.use("/movie", MovieRouter);
router.use("/profile_movie", ProfileMovieRouter);
router.use("/genre", GenreRouter);
router.use("/info", InfoRouter);
router.use("/tv", TvRouter);
router.use("/profile_tv", ProfileTvRouter);

module.exports = router;