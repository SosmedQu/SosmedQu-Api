"use strict";

// const days = [];

const {faker} = require("@faker-js/faker");
// function createRandomUser() {
//     return {
//         day: faker.internet.userName(),
//     };
// }

// Array.from({length: 10}).forEach(() => {
//     days.push(createRandomUser());
// });

const bcrypt = require("bcrypt");
const posts = [];
const postFiles = [];
const images = ["computer.jpg", "economy.jpg", "management.jpg", "matematic.jpg"];

// for (let i = 0; i < posts.length; i++) {
//     postFiles.push({
//         postId: Math.ceil(Math.random() * posts.length),
//         fileName: images[Math.floor(Math.random() * images.length)],
//     });
// }

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
            "status",
            [
                {
                    code: 0,
                    statusName: "banned",
                },
                {
                    code: 1,
                    statusName: "active",
                },
                {
                    code: 2,
                    statusName: "monitoring",
                },
            ],
            {}
        );

        await queryInterface.bulkInsert(
            "posts",
            [
                {
                    userId: 1,
                    categoryId: 1,
                    statusId: 1,
                    caption: "Inilah bedanya HTTP dengan HTTPS. Untuk sekarang https memang lebih sering dipakai nih. lebih secure....",
                },
                {
                    userId: 1,
                    categoryId: 5,
                    statusId: 1,
                    caption: "Selamat mengerjakan Latihan Soal UTBK SBMPTN yang tahu jawabannya komen dibawah ya yang benar akan dapat hadiah.",
                },
                {
                    userId: 1,
                    categoryId: 5,
                    statusId: 1,
                    caption: "Yuk latihan soal UTBK SBMPTN!. yang tahu jawabannya komen dibawah ya",
                },
                {
                    userId: 1,
                    categoryId: 1,
                    statusId: 1,
                    caption: "Kalian harus tau nih, bisa aja kedepannya Python jadi Bahasa Utama menggantikan JavaScript. Tapi menurut kalian mending mana?",
                },
                {
                    userId: 1,
                    categoryId: 5,
                    statusId: 1,
                    caption: "Jangan sampai broken terus your English hehehehehe. Nih, gimana cara translate kalimat Bahasa Inggris yang benar.",
                },
            ],
            {}
        );

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
                    category: "Bussiness",
                },
                {
                    category: "Pendidikan",
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
                    category: "Bussiness",
                },
                {
                    category: "Pendidikan",
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
                    teacher: faker.name.firstName(),
                    class: "194a25",
                    semester: 4,
                },
                {
                    userId: 1,
                    subject: "IMK",
                    dayId: 4,
                    hour: "14:30",
                    teacher: faker.name.firstName(),
                    class: "194a25",
                    semester: 4,
                },
                {
                    userId: 1,
                    subject: "MPSI",
                    dayId: 1,
                    hour: "14:30",
                    teacher: faker.name.firstName(),
                    class: "194a25",
                    semester: 4,
                },
                {
                    userId: 1,
                    subject: "WP",
                    dayId: 3,
                    hour: "14:00",
                    teacher: faker.name.firstName(),
                    class: "194a25",
                    semester: 4,
                },
                {
                    userId: 1,
                    subject: "STATISTIK",
                    dayId: 3,
                    hour: "10:30",
                    teacher: faker.name.firstName(),
                    class: "194a25",
                    semester: 5,
                },
                {
                    userId: 2,
                    subject: "STATISTIK",
                    dayId: 3,
                    hour: "14:30",
                    teacher: faker.name.firstName(),
                    class: "194a25",
                    semester: 5,
                },
                {
                    userId: 2,
                    subject: "Management",
                    dayId: 1,
                    hour: "08:30",
                    teacher: faker.name.firstName(),
                    class: "194a25",
                    semester: 5,
                },
                {
                    userId: 2,
                    subject: "Fisika",
                    dayId: 2,
                    hour: "12:30",
                    teacher: faker.name.firstName(),
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
                {
                    roleId: 2,
                    statusId: 1,
                    username: "Crownix",
                    email: "crownix@gmail.com",
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
                {
                    roleId: 1,
                    statusId: 1,
                    username: "admin",
                    email: "admin@gmail.com",
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
                    categoryId: 1,
                    name: "Hacker-Crackdown",
                    image: "hacker_crackdown.jpg",
                    fileName: "Hacker-Crackdown.pdf",
                    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est perferendis enim fugit nulla error impedit obcaecati quos.",
                    writer: "Masashi Kishimoto",
                    publisher: "Shounen Jump",
                    publicationYear: "2002",
                    isbn: 9781072125757,
                },
                {
                    userId: 1,
                    categoryId: 4,
                    name: "Emma",
                    image: "emma.jpg",
                    fileName: "Emma.pdf",
                    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est perferendis enim fugit nulla error impedit obcaecati quos.",
                    writer: "Masashi Kishimoto",
                    publisher: "Shounen Jump",
                    publicationYear: "2002",
                    isbn: 9781072125757,
                },
                {
                    userId: 1,
                    categoryId: 1,
                    name: "3D-Graphics-Modelling-and-Rendering-mini-HOWTO",
                    image: "3d_graphics.jpg",
                    fileName: "3D-Graphics-Modelling-and-Rendering-mini-HOWTO.pdf",
                    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est perferendis enim fugit nulla error impedit obcaecati quos.",
                    writer: "Masashi Kishimoto",
                    publisher: "Shounen Jump",
                    publicationYear: "2002",
                    isbn: 9781072125757,
                },
                {
                    userId: 1,
                    categoryId: 1,
                    name: "The-Hacker's-Dictionary",
                    image: "hacker_dictionary.jpg",
                    fileName: "The-Hacker's-Dictionary.pdf",
                    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est perferendis enim fugit nulla error impedit obcaecati quos.",
                    writer: "Masashi Kishimoto",
                    publisher: "Shounen Jump",
                    publicationYear: "2002",
                    isbn: 9781072125757,
                },
                {
                    userId: 1,
                    categoryId: 1,
                    name: "The-Size-of-Your-Dreams",
                    image: "size.jpg",
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

        await queryInterface.bulkInsert(
            "post_files",
            [
                {
                    postId: 1,
                    fileName: "1.png",
                },
                {
                    postId: 2,
                    fileName: "2.png",
                },
                {
                    postId: 3,
                    fileName: "3.png",
                },
                {
                    postId: 4,
                    fileName: "4.png",
                },
                {
                    postId: 5,
                    fileName: "5.png",
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
