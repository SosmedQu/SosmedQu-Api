module.exports = (sequelize, Sequelize) => {
    const Chatting = sequelize.define(
        "Chatting",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            from: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            to: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            message: {
                type: Sequelize.TEXT,
            },
            status: {
                type: Sequelize.INTEGER,
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
            tableName: "chattings",
        }
    );

    return Chatting;
};
