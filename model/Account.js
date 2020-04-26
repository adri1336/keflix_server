require("dotenv").config();
const { sequelize } = require("./index");
const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcrypt");
const saltRounds = 10;

class Account extends Model {
    async validPassword(password) {
        return await bcrypt.compare(password, this.password);
    }
}

Account.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    email: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.CHAR(60),
        allowNull: false
    }
}, {
    sequelize,
    modelName: "account",
    freezeTableName: true
});

Account.beforeCreate(async (account) => {
    account.password = await bcrypt.hash(account.password, saltRounds);
});

Account.beforeUpdate(async (account) => {
    account.password = await bcrypt.hash(account.password, saltRounds);
});

module.exports = Account;