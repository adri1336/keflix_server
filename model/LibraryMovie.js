module.exports = (sequelize, DataTypes) => {
    const LibraryMovie = sequelize.define("library_movie",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            id_movie: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true
            },
            total_views: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            views_last_month: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            views_last_week: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            views_today: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
        },
        {
            freezeTableName: true
        }
    );

    LibraryMovie.afterCreate(async (libraryMovie) => {
        //TMDb API
        const { refreshGenres, createMovie } = require("../scripts/TMDb");
        try {
            await refreshGenres();
            await createMovie(libraryMovie);
        }
        catch(error) {
            console.log("LibraryMovie.afterCreate error: ", error);
        }
    });

    return LibraryMovie;
};