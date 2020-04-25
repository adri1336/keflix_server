const router = require("express").Router();

const AccountRouter = require("./Account");

router.use("/account", AccountRouter);

module.exports = router;