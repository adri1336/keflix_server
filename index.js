require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const pjson = require("./package.json");

require("./config/db");
const router = require("./routes/index");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.clear();
console.log("--- KEFLIX SERVER " + pjson.version + " ---\nDesarrollado por: adri1 (https://github.com/adri1336/)\n");
if(
    process.env.APP_PORT &&
    process.env.ACCESS_TOKEN_SECRET &&
    process.env.ACCESS_TOKEN_EXPIRES_IN &&
    process.env.REFRESH_TOKEN_SECRET &&
    process.env.REFRESH_TOKEN_EXPIRES_IN &&
    process.env.MEDIA_PATH &&
    process.env.DATABASE_PATH
) {
    app.use(fileUpload({
        useTempFiles : true,
        tempFileDir : process.env.MEDIA_PATH + "/tmp"
    }));

    app.use("/api", router);
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
        \t DATABASE_PATH\n\
        \t DEBUG_ENABLED (opcional)\n\
        \t DATABASE_LOGGING (opcional)\n\
        \t FORCE_DATABASE_SYNC (opcional)\n\
    ");
}