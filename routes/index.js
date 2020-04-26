const router = require("express").Router();

const AuthRouter = require("./Auth");
const AccountRouter = require("./Account");

router.use("/auth", AuthRouter);
router.use("/account", AccountRouter);

module.exports = router;