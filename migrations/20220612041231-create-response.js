"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("responses", {
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
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("responses");
    },
};
