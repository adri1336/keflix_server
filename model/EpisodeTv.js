require("dotenv").config();
const fs = require("fs");

module.exports = (sequelize, DataTypes) => {
    const EpisodeTv = sequelize.define("episode_tv",
        {
            season: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            episode: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING(128)
            },
            overview: {
                type: DataTypes.STRING(1024),
                allowNull: true
            }
        },
        {
            freezeTableName: true
        }
    );

    EpisodeTv.beforeDestroy((theEpisode, options) => {
        const { tvId, season, episode } = theEpisode;

        const path = process.env.MEDIA_PATH + "/tv/" + tvId + "/" + season + "/" + episode + "/";
        fs.promises.rmdir(path, { recursive: true });
    });

    return EpisodeTv;
};