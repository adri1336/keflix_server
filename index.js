require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const pjson = require("./package.json");

require("./config/db");
const router = require("./routes/index");

const app = express();
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Accept, Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    if(req.method == "OPTIONS") {
        res.sendStatus(200);
    }
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", router);

console.log("--- KEFLIX SERVER " + pjson.version + " ---\nDesarrollado por: adri1 (https://github.com/adri1samp/)\n");
if(
    process.env.APP_PORT &&
    process.env.ACCESS_TOKEN_SECRET &&
    process.env.ACCESS_TOKEN_EXPIRES_IN &&
    process.env.REFRESH_TOKEN_SECRET &&
    process.env.REFRESH_TOKEN_EXPIRES_IN &&
    process.env.MEDIA_PATH
) { 
    app.listen(process.env.APP_PORT, () => {
        console.log("OK! Servidor encendido y escuchando por el puerto: " + process.env.APP_PORT);
    });
}
else {
    console.log("Error! El archivo de configuración .env no es válido, debe contener los siguientes parámetros:");
    console.log("\
        \t APP_PORT\n\
        \t ACCESS_TOKEN_SECRET\n\
        \t ACCESS_TOKEN_EXPIRES_IN\n\
        \t REFRESH_TOKEN_SECRET\n\
        \t REFRESH_TOKEN_EXPIRES_IN\n\
        \t MEDIA_PATH\n\
    ");
}