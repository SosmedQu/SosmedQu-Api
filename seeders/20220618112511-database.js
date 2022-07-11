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
        fileName: images[Math.floor(Math.random() * images.length)],
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
                {
                    category: "Computer",
                },
                {
                    category: "Bussiness",
                },
            ],
            {}
        );

        await queryInterface.bulkInsert(
            "days",
            [
                {
                    day: "Senin",
                },
                {
                    day: "Selasa",
                },
                {
                    day: "Rabu",
                },
                {
                    day: "Kamis",
                },
                {
                    day: "Jumat",
                },
                {
                    day: "Sabtu",
                },
                {
                    day: "Minggu",
                },
            ],
            {}
        );

        await queryInterface.bulkInsert(
            "ebook_categories",
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
                {
                    category: "Computer",
                },
                {
                    category: "Bussiness",
                },
            ],
            {}
        );

        await queryInterface.bulkInsert(
            "lesson_timetables",
            [
                {
                    userId: 1,
                    subject: "MP",
                    dayId: 2,
                    hour: "14:30",
                    teacher: "Andri",
                    class: "194a25",
                    semester: 4,
                },
                {
                    userId: 1,
                    subject: "IMK",
                    dayId: 4,
                    hour: "14:30",
                    teacher: "Anggraini",
                    class: "194a25",
                    semester: 4,
                },
                {
                    userId: 1,
                    subject: "MPSI",
                    dayId: 1,
                    hour: "14:30",
                    teacher: "Yeni",
                    class: "194a25",
                    semester: 4,
                },
                {
                    userId: 1,
                    subject: "WP",
                    dayId: 3,
                    hour: "14:30",
                    teacher: "Anggie",
                    class: "194a25",
                    semester: 4,
                },
                {
                    userId: 1,
                    subject: "STATISTIK",
                    dayId: 3,
                    hour: "14:30",
                    teacher: "Dirga",
                    class: "194a25",
                    semester: 5,
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
                    nisn: "3027006621",
                    studyAt: "UBSI",
                    province: "Jakarta Barat",
                },
            ],
            {}
        );

        await queryInterface.bulkInsert(
            "ebooks",
            [
                {
                    userId: 1,
                    categoryId: 4,
                    name: "Hacker-Crackdown",
                    fileName: "Hacker-Crackdown.pdf",
                    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est perferendis enim fugit nulla error impedit obcaecati quos.",
                    writer: "Masashi Kishimoto",
                    publisher: "Shounen Jump",
                    publicationYear: "2002",
                    isbn: 9781072125757,
                },
                {
                    userId: 1,
                    categoryId: 5,
                    name: "Emma",
                    fileName: "Emma.pdf",
                    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est perferendis enim fugit nulla error impedit obcaecati quos.",
                    writer: "Masashi Kishimoto",
                    publisher: "Shounen Jump",
                    publicationYear: "2002",
                    isbn: 9781072125757,
                },
                {
                    userId: 1,
                    categoryId: 4,
                    name: "3D-Graphics-Modelling-and-Rendering-mini-HOWTO",
                    fileName: "3D-Graphics-Modelling-and-Rendering-mini-HOWTO.pdf",
                    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est perferendis enim fugit nulla error impedit obcaecati quos.",
                    writer: "Masashi Kishimoto",
                    publisher: "Shounen Jump",
                    publicationYear: "2002",
                    isbn: 9781072125757,
                },
                {
                    userId: 1,
                    categoryId: 4,
                    name: "The-Hacker's-Dictionary",
                    fileName: "The-Hacker's-Dictionary.pdf",
                    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est perferendis enim fugit nulla error impedit obcaecati quos.",
                    writer: "Masashi Kishimoto",
                    publisher: "Shounen Jump",
                    publicationYear: "2002",
                    isbn: 9781072125757,
                },
                {
                    userId: 1,
                    categoryId: 4,
                    name: "The-Size-of-Your-Dreams",
                    fileName: "The-Size-of-Your-Dreams.pdf",
                    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est perferendis enim fugit nulla error impedit obcaecati quos.",
                    writer: "Masashi Kishimoto",
                    publisher: "Shounen Jump",
                    publicationYear: "2002",
                    isbn: 9781072125757,
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
