module.exports = (sequelize, type) => {
    return sequelize.define("account",  {
        id: {
            type: type.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: type.STRING(64),
            allowNull: false
        },
        password: {
            type: type.CHAR(60),
            allowNull: false
        }
    }, {
        freezeTableName: true
    });
};