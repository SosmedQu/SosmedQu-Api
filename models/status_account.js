module.exports = (sequelize, Sequelize) => {
    const StatusAccount = sequelize.define(
        "StatusAccount",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            code: {
                type: Sequelize.INTEGER,
            },
            statusName: {
                type: Sequelize.STRING,
            },
        },
        {
            freezeTableName: true,
            tableName: "status_accounts",
        }
    );

    return StatusAccount;
};
