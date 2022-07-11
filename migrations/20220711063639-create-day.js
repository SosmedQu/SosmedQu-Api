"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("days", {
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
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("days");
    },
};
