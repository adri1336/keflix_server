module.exports = (sequelize, DataTypes) => {
    return sequelize.define("movie",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            published: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            adult: {
                type: DataTypes.BOOLEAN,
                allowNull: false
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