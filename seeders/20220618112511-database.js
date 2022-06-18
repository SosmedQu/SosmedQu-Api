"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "roles",
            [
                {
                    roleName: "admin",
                },
                {
                    roleName: "pelajar",
                },
                {
                    roleName: "umum",
                },
            ],
            {}
        );

        await queryInterface.bulkInsert(
            "status_accounts",
            [
                {
                    code: 0,
                    statusName: "banned",
                },
                {
                    code: 1,
                    statusName: "terverivikasi",
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
};
