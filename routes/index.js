const router = require("express").Router();

const AuthRouter = require("./Auth");
const AccountRouter = require("./Account");
const ProfileRouter = require("./Profile");

router.use("/auth", AuthRouter);
router.use("/account", AccountRouter);
router.use("/profile", ProfileRouter);

module.exports = router;