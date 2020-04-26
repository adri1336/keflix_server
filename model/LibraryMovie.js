module.exports = (sequelize, DataTypes) => {
    return sequelize.define("library_movie",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            id_movie: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true
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
};