module.exports = (sequelize, DataTypes) => {
    return sequelize.define("profile_movie",
        {
            completed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
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