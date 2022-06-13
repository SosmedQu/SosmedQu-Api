module.exports = (sequelize, Sequelize) => {
    const LabelNote = sequelize.define(
        "LabelNote",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            labelName: {
                type: Sequelize.STRING,
            },
            color: {
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
            tableName: "label_notes",
        }
    );

    return LabelNote;
};
