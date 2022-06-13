module.exports = (sequelize, Sequelize) => {
    const Violation = sequelize.define(
        "Violation",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            reporter: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            feature: {
                type: Sequelize.STRING,
            },
            featureId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            description: {
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
            tableName: "violations",
        }
    );

    return Violation;
};
