require("dotenv").config();
const Sequelize = require("sequelize");
const CronJob = require("cron").CronJob;
const readline = require("readline");
let creatingAccount = false;

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
        logging: process.env.DATABASE_LOGGING == true ? console.log : false,
        force: process.env.FORCE_DATABASE_SYNC == true ? true : false
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
        sequelize.sync({ force: false }).then(async () => {
            console.log("OK! Base de datos sincronizada:");
            await printDbInfo();

            if(process.env.DEBUG_ENABLED == true) {
                const KEY = "a";
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                    terminal: true
                });
                
                process.stdin.on("keypress", character => {
                    if(!creatingAccount && character == KEY) {
                        console.clear();
                        creatingAccount = true;
                        
                        rl.line = "";
                        rl.question("Introduce correo electrónico: ", email => {
                            rl.question("Introduce contraseña: ", async password => {
                                if(email.length > 0 && password.length > 0) {
                                    const account = await Account.create({ email: email, password: password, admin: true });
                                    if(account) {
                                        console.log("OK! Cuenta creada, ID: " + account.id + "\n\n");
                                    }
                                    else {
                                        console.log("Error! No se pudo crear la cuenta\n\n");
                                    }
                                }
                                else {
                                    console.log("Cancelado\n\n");
                                }
                                creatingAccount = false;
                            });
                        });
                    }
                });

                console.log("\n\n\nATENCIÓN: Modo depuración activado, presiona " + KEY.toUpperCase() + " para crear una cuenta con derechos de administrador.\n\n");
            }
            else {
                console.log = function() {};
            }
        });
    })
    .catch(error => {
        console.log("Error! No se pudo conectar con la base de datos: ", error);
        if(!(process.env.DEBUG_ENABLED == true)) {
            console.log = function() {};
        }
    });

async function printDbInfo() {
    let count = 0;
    count = await Account.count();
    console.log("\tCuentas: " + count);

    count = await Profile.count();
    console.log("\tPerfiles: " + count);

    count = await Movie.count();
    console.log("\tPelículas: " + count);
}

module.exports = {
    Account,
    Profile,
    ProfileMovie,
    Genre,
    Movie
};