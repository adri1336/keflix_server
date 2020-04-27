require("dotenv").config();
const Sequelize = require("sequelize");

const
    AccountModel = require("../model/Account"),
    ProfileModel = require("../model/Profile"),
    LibraryMovieModel = require("../model/LibraryMovie"),
    ProfileLibraryMovieModel = require("../model/ProfileLibraryMovie");

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

const
    Account = AccountModel(sequelize, Sequelize),
    Profile = ProfileModel(sequelize, Sequelize),
    LibraryMovie = LibraryMovieModel(sequelize, Sequelize),
    ProfileLibraryMovie = ProfileLibraryMovieModel(sequelize, Sequelize);

// --- Associations ---
//Account-Profile
Account.hasMany(Profile, {
    foreignKey: {
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    }
});
Profile.belongsTo(Account);

//Profile-LibraryMovie
Profile.belongsToMany(LibraryMovie, { through: ProfileLibraryMovie });
LibraryMovie.belongsToMany(Profile, { through: ProfileLibraryMovie });

sequelize.authenticate()
    .then(() => {
        console.log("DB Connected");
        sequelize.sync({ force: false }).then(() => {
            console.log("DB Synced");
        });
    })
    .catch(error => console.log("DB Connection Error: ", error));

module.exports = {
    Account,
    Profile,
    LibraryMovie,
    ProfileLibraryMovie
};