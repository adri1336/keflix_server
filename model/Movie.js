require("dotenv").config();
const fs = require("fs");

module.exports = (sequelize, DataTypes) => {
    const Movie = sequelize.define("movie",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            published: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            adult: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            original_title: {
                type: DataTypes.STRING(128),
                allowNull: true
            },
            overview: {
                type: DataTypes.STRING(1024),
                allowNull: true
            },
            popularity: {
                type: DataTypes.FLOAT,
                allowNull: true
            },
            release_date: {
                type: DataTypes.DATE,
                allowNull: true
            },
            runtime: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            tagline: {
                type: DataTypes.STRING(128),
                allowNull: true
            },
            title: {
                type: DataTypes.STRING(128),
                allowNull: false
            },
            vote_average: {
                type: DataTypes.FLOAT,
                allowNull: true
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

    Movie.beforeDestroy((movie, options) => {
        const { id } = movie;

        const path = process.env.MEDIA_PATH + "/movies/" + id + "/";
        fs.promises.rmdir(path, { recursive: true });
    });

    return Movie;
};