require("dotenv").config();
const rmdir = require("rimraf");

module.exports = (sequelize, DataTypes) => {
    const Tv = sequelize.define("tv",
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
            original_name: {
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
            first_air_date: {
                type: DataTypes.DATE,
                allowNull: true
            },
            name: {
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

    Tv.beforeDestroy((tv, options) => {
        const { id } = tv;

        const path = process.env.MEDIA_PATH + "/tv/" + id;
        rmdir(path, function(error) { if(error) console.log(error) });
    });

    return Tv;
};