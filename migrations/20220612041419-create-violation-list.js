"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("violation_lists", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            violationName: {
                type: Sequelize.STRING,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("violation_lists");
    },
};
