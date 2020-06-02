require("dotenv").config();
const Sequelize = require("sequelize");
const CronJob = require("cron").CronJob;

const
    AccountModel = require("../model/Account"),
    ProfileModel = require("../model/Profile"),
    ProfileMovieModel = require("../model/ProfileMovie"),
    GenreModel = require("../model/Genre"),
    MovieModel = require("../model/Movie");

const sequelize = new Sequelize(
    {
        dialect: "sqlite",
        storage: "database.sqlite",
        logging: process.env.DEBUG_ENABLED ? console.log : false,
        force: process.env.FORCE_DATABASE_SYNC ? true : false
    }
);

const
    Account = AccountModel(sequelize, Sequelize),
    Profile = ProfileModel(sequelize, Sequelize),
    ProfileMovie = ProfileMovieModel(sequelize, Sequelize),
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

//Account-Movie
Account.hasMany(Movie, {
    foreignKey: {
        allowNull: true, //posibilidad de añadir pelicula sin cuenta (manualmente, no recomendado)
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    }
});
Movie.belongsTo(Account);

//Account-Genre
Account.hasMany(Genre, {
    foreignKey: {
        allowNull: true, //posibilidad de añadir género sin cuenta (manualmente, no recomendado)
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
    }
});
Genre.belongsTo(Account);

//Profile-Movie
Profile.belongsToMany(Movie, { through: ProfileMovie });
Movie.belongsToMany(Profile, { through: ProfileMovie });

//Movie-Genre
Movie.belongsToMany(Genre, { through: "movie_genre" });
Genre.belongsToMany(Movie, { through: "movie_genre" });


// --- Cron Jobs ---
//Movie (restablecer a 0 views_today todos los días a las 00:00)
new CronJob("0 0 * * *", async () => {
    await Movie.update({ views_today: 0 }, { where: {} });
}).start();

//Movie (restablecer a 0 views_last_week todos los lunes a las 00:00)
new CronJob("0 0 * * 1", async () => {
    await Movie.update({ views_last_week: 0 }, { where: {} });
}).start();

//Movie (restablecer a 0 views_last_month el primer día del mes a las 00:00)
new CronJob("0 0 1 * *", async () => {
    await Movie.update({ views_last_month: 0 }, { where: {} });
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

    if(!process.env.DEBUG_ENABLED) {
        console.log = function() {};
    }
}

module.exports = {
    Account,
    Profile,
    ProfileMovie,
    Genre,
    Movie
};