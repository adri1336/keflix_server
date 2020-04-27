module.exports = (sequelize, DataTypes) => {
    return sequelize.define("movie",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            adult: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
            backdrop_path: {
                type: DataTypes.STRING(128),
                allowNull: true
            },
            original_title: {
                type: DataTypes.STRING(128),
                allowNull: false
            },
            overview: {
                type: DataTypes.STRING(1024),
                allowNull: true
            },
            popularity: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            poster_path: {
                type: DataTypes.STRING(128),
                allowNull: true
            },
            release_date: {
                type: DataTypes.DATE,
                allowNull: false
            },
            runtime: {
                type: DataTypes.INTEGER,
                allowNull: true
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
                allowNull: false
            },
            trailer_youtube_key: {
                type: DataTypes.STRING(64),
                allowNull: true
            }
        },
        {
            freezeTableName: true
        }
    );
};