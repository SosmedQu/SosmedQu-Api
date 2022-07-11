module.exports = (sequelize, Sequelize) => {
    const Day = sequelize.define(
        "Day",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            day: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: new Date(),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: new Date(),
            },
        },
        {
            freezeTableName: true,
            tableName: "days",
        }
    );

    return Day;
};
