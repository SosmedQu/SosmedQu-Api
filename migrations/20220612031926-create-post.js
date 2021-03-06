"use strict";

const {sequelize} = require("../models");

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("posts", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            categoryId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            statusId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            caption: {
                type: Sequelize.TEXT,
            },
            privacy: {
                type: Sequelize.STRING,
                defaultValue: "public",
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
        await queryInterface.dropTable("posts");
    },
};
