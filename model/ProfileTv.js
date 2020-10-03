module.exports = (sequelize, DataTypes) => {
    return sequelize.define("profile_tv",
        {
            season: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            episode: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            current_time: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            fav: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        },
        {
            freezeTableName: true
        }
    );
};