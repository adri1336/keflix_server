const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes/index");
require("./model/index");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", router);

app.listen(3000, () => {
    console.log("cuervo_api started");
});