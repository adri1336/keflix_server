const Sequelize = require("sequelize");

const
    db_host = "localhost",
    db_name = "cuervo",
    db_user = "root",
    db_password = "root",
    db_port = "3306";

const AccountModel = require("./model/Account");

const sequelize = new Sequelize(db_name, db_user, db_password, {
    host: db_host,
    port: db_port,
    dialect: "mysql"
});

const Account = AccountModel(sequelize, Sequelize);

sequelize.sync({ force: false }).then(() => {
    console.log("db sync");
});

module.exports = {
    Account
};