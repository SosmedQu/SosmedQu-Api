"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("ebooks", {
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
            name: {
                type: Sequelize.STRING,
            },
            image: {
                type: Sequelize.STRING,
            },
            fileName: {
                type: Sequelize.STRING,
            },
            description: {
                type: Sequelize.TEXT,
            },
            writer: {
                type: Sequelize.STRING,
            },
            publisher: {
                type: Sequelize.STRING,
            },
            publicationYear: {
                type: Sequelize.STRING,
            },
            isbn: {
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
        await queryInterface.dropTable("ebooks");
    },
};
