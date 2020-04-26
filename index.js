require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

require("./config/db");
const router = require("./routes/index");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", router);

app.listen(process.env.APP_PORT, () => {
    console.log("cuervo_api, port: ", process.env.APP_PORT);
});