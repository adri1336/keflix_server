require("dotenv").config();
const Sequelize = require("sequelize");

const
    db_host = process.env.DB_HOST,
    db_name = process.env.DB_NAME,
    db_user = process.env.DB_USER,
    db_pass = process.env.DB_PASS,
    db_port = process.env.DB_PORT;

const sequelize = new Sequelize(db_name, db_user, db_pass, {
    host: db_host,
    port: db_port,
    dialect: "mysql"
});

sequelize.sync({ force: false }).then(() => {
    console.log("db synced");
});

module.exports = {
    sequelize
};