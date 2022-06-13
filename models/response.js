module.exports = (sequelize, Sequelize) => {
    const Response = sequelize.define(
        "Response",
        {
            postId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            response: {
                type: Sequelize.ENUM,
                values: ["like", "dislike"],
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
            tableName: "responses",
        }
    );

    return Response;
};
