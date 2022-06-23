"use strict";

const bcrypt = require("bcrypt");
const posts = [];
const postFiles = [];
const images = ["computer.jpg", "economy.jpg", "management.jpg", "matematic.jpg"];
for (let i = 0; i < 10; i++) {
    posts.push({
        userId: 1,
        categoryId: Math.ceil(Math.random() * 3),
        caption:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est perferendis enim fugit nulla error impedit obcaecati quos. Qui odit asperiores quaerat exercitationem quam tempore ipsam ullam temporibus id, labore totam repudiandae vero, reiciendis sed atque neque, autem ipsum sapiente nulla! Cupiditate atque laudantium voluptas iusto impedit quisquam quos vel aperiam.",
    });
}

for (let i = 0; i < posts.length; i++) {
    postFiles.push({
        postId: Math.ceil(Math.random() * posts.length),
        fileName: images[Math.ceil(Math.random() * images.length)],
    });
}

module.exports = {
    async up(queryInterface, Sequelize) {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash("12345678", salt);
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

        await queryInterface.bulkInsert("posts", posts, {});

        await queryInterface.bulkInsert(
            "post_categories",
            [
                {
                    category: "Teknologi",
                },
                {
                    category: "Ekonomi",
                },
                {
                    category: "Managemen",
                },
            ],
            {}
        );

        await queryInterface.bulkInsert(
            "users",
            [
                {
                    roleId: 2,
                    statusId: 1,
                    username: "Rahmat",
                    email: "rahmatfauzi841@gmail.com",
                    password: hashPassword,
                    gender: "laki-laki",
                    placeOfBirth: "Tegal",
                    birthDay: new Date("2002-08-19"),
                    noHp: "087881955171",
                    studentCard: "default.jpg",
                    nisn: "19200850",
                    studyAt: "UBSI",
                    province: "Jakarta Barat",
                },
            ],
            {}
        );

        await queryInterface.bulkInsert("post_files", postFiles, {});
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
