module.exports = (sequelize, Sequelize) => {
    const ViolationList = sequelize.define(
        "ViolationList",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            violationName: {
                type: Sequelize.STRING,
            },
        },
        {
            freezeTableName: true,
            tableName: "violation_lists",
        }
    );

    return ViolationList;
};
