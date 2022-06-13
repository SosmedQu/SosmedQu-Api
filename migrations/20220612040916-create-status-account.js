"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("status_accounts", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            code: {
                type: Sequelize.INTEGER,
            },
            statusName: {
                type: Sequelize.STRING,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("status_accounts");
    },
};
