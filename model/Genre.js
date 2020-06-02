module.exports = (sequelize, DataTypes) => {
    return sequelize.define("genre",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING(64),
                allowNull: false
            }
        },
        {
            freezeTableName: true
        }
    );
};