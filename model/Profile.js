const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = (sequelize, DataTypes) => {
    const Profile = sequelize.define("profile",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING(24),
                allowNull: false
            },
            password: { //profile pin code (optional)
                type: DataTypes.CHAR(60),
                allowNull: true
            },
            color: {
                type: DataTypes.STRING(24),
                allowNull: false
            },
            adult_content: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        },
        {
            freezeTableName: true
        }
    );

    Profile.beforeCreate(async (profile) => {
        if(profile.password) {
            profile.password = await bcrypt.hash(profile.password, saltRounds);
        }
    });

    Profile.beforeUpdate(async (profile) => {
        if(profile.password) {
            profile.password = await bcrypt.hash(profile.password, saltRounds);
        }
    });

    Profile.prototype.checkPassword = async function(password) { 
        return await bcrypt.compare(password, this.password);
    };

    return Profile;
};