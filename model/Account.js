const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = (sequelize, DataTypes) => {
    const Account = sequelize.define("account",
        {
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
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            password: {
                type: DataTypes.CHAR(60),
                allowNull: false
            }
        },
        {
            freezeTableName: true
        }
    );

    Account.beforeCreate(async (account) => {
        account.password = await bcrypt.hash(account.password, saltRounds);
    });

    Account.beforeUpdate(async (account) => {
        account.password = await bcrypt.hash(account.password, saltRounds);
    });

    Account.prototype.checkPassword = async function(password) {
        return await bcrypt.compare(password, this.password);
    };

    return Account;
};