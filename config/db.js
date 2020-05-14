const Sequelize = require("sequelize");
const CronJob = require("cron").CronJob;

const
    AccountModel = require("../model/Account"),
    ProfileModel = require("../model/Profile"),
    LibraryMovieModel = require("../model/LibraryMovie"),
    ProfileLibraryMovieModel = require("../model/ProfileLibraryMovie"),
    GenreModel = require("../model/Genre"),
    MovieModel = require("../model/Movie");

const sequelize = new Sequelize(
    {
        dialect: "sqlite",
        storage: "database.sqlite",
        logging: false
    }
);

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
Profile.belongsToMany(LibraryMovie, { through: ProfileLibraryMovie });
LibraryMovie.belongsToMany(Profile, { through: ProfileLibraryMovie });

//Movie-Genre
Movie.belongsToMany(Genre, { through: "movie_genre" });
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
        console.log("OK! Base de datos conectada");
        sequelize.sync({ force: false }).then(() => {
            console.log("OK! Base de datos sincronizada:");
            printDbInfo();
        });
    })
    .catch(error => {
        console.log("Error! No se pudo conectar con la base de datos: ", error);
        console.log = function() {};
    });

async function printDbInfo() {
    let count = 0;
    count = await Account.count();
    console.log("\tCuentas: " + count);

    count = await Profile.count();
    console.log("\tPerfiles: " + count);

    count = await Movie.count();
    console.log("\tPelículas: " + count);

    console.log = function() {};
}

module.exports = {
    Account,
    Profile,
    LibraryMovie,
    ProfileLibraryMovie,
    Genre,
    Movie
};