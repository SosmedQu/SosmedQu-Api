"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("schools", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            provinceCode: {
                type: Sequelize.INTEGER,
            },
            province: {
                type: Sequelize.STRING,
            },
            districtCode: {
                type: Sequelize.INTEGER,
            },
            district: {
                type: Sequelize.STRING,
            },
            subDistrictCode: {
                type: Sequelize.INTEGER,
            },
            subDistrict: {
                type: Sequelize.STRING,
            },
            schoolId: {
                type: Sequelize.STRING,
            },
            npsn: {
                type: Sequelize.INTEGER,
            },
            school: {
                type: Sequelize.STRING,
            },
            level: {
                type: Sequelize.STRING,
            },
            status: {
                type: Sequelize.STRING,
            },
            streetAddress: {
                type: Sequelize.STRING,
            },
            latitude: {
                type: Sequelize.DECIMAL(9, 7),
            },
            longitude: {
                type: Sequelize.DECIMAL(10, 7),
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
        await queryInterface.dropTable("schools");
    },
};
