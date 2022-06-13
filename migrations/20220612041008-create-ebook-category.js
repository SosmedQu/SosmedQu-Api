"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("ebook_categories", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            category: {
                type: Sequelize.STRING,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("ebook_categories");
    },
};
