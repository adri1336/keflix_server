require("dotenv").config();
const Sequelize = require("sequelize");
const CronJob = require('cron').CronJob;

const
    AccountModel = require("../model/Account"),
    ProfileModel = require("../model/Profile"),
    LibraryMovieModel = require("../model/LibraryMovie"),
    ProfileLibraryMovieModel = require("../model/ProfileLibraryMovie"),
    GenreModel = require("../model/Genre"),
    MovieModel = require("../model/Movie");

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
    ProfileLibraryMovie = ProfileLibraryMovieModel(sequelize, Sequelize),
    Genre = GenreModel(sequelize, Sequelize),
    Movie = MovieModel(sequelize, Sequelize);


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

//Account-LibraryMovie
Account.hasMany(LibraryMovie, {
    foreignKey: {
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    }
});
LibraryMovie.belongsTo(Account);

//Profile-LibraryMovie
Profile.hasMany(LibraryMovie, {
    foreignKey: {
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    }
});
LibraryMovie.belongsToMany(Profile, { through: ProfileLibraryMovie });

//Movie-Genre
Movie.hasMany(Genre, {
    foreignKey: {
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    }
});
Genre.belongsToMany(Movie, { through: "movie_genre" });

//Account-Movie
LibraryMovie.hasOne(Movie, {
    foreignKey: {
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    }
});
Movie.belongsTo(LibraryMovie);


// --- Cron Jobs ---
//LibraryMovie (restablecer a 0 views_today todos los días a las 00:00)
new CronJob("0 0 * * *", async () => {
    await LibraryMovie.update({ views_today: 0 }, { where: {} });
}).start();

//LibraryMovie (restablecer a 0 views_last_week todos los lunes a las 00:00)
new CronJob("0 0 * * 1", async () => {
    await LibraryMovie.update({ views_last_week: 0 }, { where: {} });
}).start();

//LibraryMovie (restablecer a 0 views_last_month el primer día del mes a las 00:00)
new CronJob("0 0 1 * *", async () => {
    await LibraryMovie.update({ views_last_month: 0 }, { where: {} });
}).start();


sequelize.authenticate()
    .then(() => {
        console.log("DB Connected");
        sequelize.sync({ force: true }).then(() => {
            console.log("DB Synced");
        });
    })
    .catch(error => console.log("DB Connection Error: ", error));

module.exports = {
    Account,
    Profile,
    LibraryMovie,
    ProfileLibraryMovie,
    Genre,
    Movie
};