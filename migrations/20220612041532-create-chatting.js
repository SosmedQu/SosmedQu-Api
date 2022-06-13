"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("chattings", {
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
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("chattings");
    },
};
