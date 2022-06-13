"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("violations", {
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
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("violations");
    },
};
