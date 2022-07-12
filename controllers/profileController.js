require("dotenv").config();
const {validationResult} = require("express-validator");
const {User, Role, Post, PostCategory, PostFile, Ebook, EbookCategory, Follow} = require("../models");
const fs = require("fs");
const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");
const {Sequelize, Op} = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: 5432,
    dialect: process.env.DB_DIALECT,
    logging: false,
});

const getMyProfile = async (req, res) => {
    const decoded = jwt_decode(req.cookies.accessToken);

    try {
        const user = await User.findOne({where: {id: decoded.userId}});

        if (!user) return res.status(404).json({msg: "Not Found"});

        const following = await Follow.findAll({
            where: {userId: decoded.userId},
            attributes: [[sequelize.fn("COUNT", sequelize.col("userId")), "following"]],
        });

        const follower = await Follow.findAll({
            where: {following: decoded.userId},
            attributes: [[sequelize.fn("COUNT", sequelize.col("following")), "follower"]],
        });

        return res.status(200).json({user, following, follower});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const getProfile = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findOne({
            where: {id},
        });

        if (!user) return res.status(404).json({msg: "Not Found"});

        const following = await Follow.findAll({
            where: {userId: id},
            attributes: [[sequelize.fn("COUNT", sequelize.col("userId")), "following"]],
        });

        const follower = await Follow.findAll({
            where: {following: id},
            attributes: [[sequelize.fn("COUNT", sequelize.col("following")), "follower"]],
        });

        if (req.cookies.accessToken) {
            const decoded = jwt_decode(req.cookies.accessToken);
            const checkFollow = (await Follow.findOne({
                where: {[Op.and]: [{userId: decoded.userId}, {following: id}]},
            }))
                ? true
                : false;
            return res.status(200).json({user, following, follower, checkFollow});
        }

        return res.status(200).json({user, following, follower});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const getAllPost = async (req, res) => {
    const id = req.params.id;

    try {
        const posts = await Post.findAll({
            where: {userId: id},
            include: [
                {
                    model: PostCategory,
                },
                {
                    model: User,
                    attributes: ["id", "username", "image"],
                },
                {
                    model: PostFile,
                },
            ],
            order: [["id", "DESC"]],
        });

        if (posts.length == 0) {
            return res.status(404).json({msg: "Not Found"});
        }

        return res.status(200).json({posts});
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

const getAllEbook = async (req, res) => {
    const id = req.params.id;

    try {
        const ebooks = await Ebook.findAll({
            where: {userId: id},
            include: [
                {
                    model: EbookCategory,
                },
            ],
            order: [["id", "DESC"]],
        });

        if (ebooks.length == 0) {
            return res.status(404).json({msg: "Not Found"});
        }

        return res.status(200).json({ebooks});
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

const validateStudent = async (req, res) => {
    const {username, gender, placeOfBirth, birthDay, noHp, email, nisn, studyAt, province} = req.body;
    const convertBirthDay = new Date(birthDay);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({errors: errors.array()});
    }

    // const regex = /^data:.+\/(.+);base64,(.*)$/;
    // const matches = studentCard.match(regex);
    // const ext = matches[1];
    // const data = matches[2];
    // const buffer = Buffer.from(data, "base64");
    // const fileName = `${Date.now()}.${ext}`;
    // fs.writeFileSync(`./public/images/studentCard/${fileName}`, buffer);

    try {
        await User.update(
            {
                roleId: 2,
                username,
                gender,
                placeOfBirth,
                birthDay: convertBirthDay,
                noHp,
                studentCard: req.file.filename,
                nisn,
                studyAt,
                province,
            },
            {
                where: {
                    email,
                },
            }
        );

        const user = await User.findOne({
            where: {email},
            include: [
                {
                    model: Role,
                },
            ],
        });

        const accessToken = jwt.sign(
            {userId: user.id, statusId: user.statusId, username: user.username, role: user.Role.roleName, province: user.province, gender: user.gender, studyAt: user.studyAt, createdAt: user.createdAt},
            process.env.ACCESS_TOKEN_SECRET
        );

        await User.update(
            {accessToken},
            {
                where: {
                    email,
                },
            }
        );

        res.cookie("accessToken", accessToken);

        return res.status(200).json({msg: "Validasi siswa berhasil"});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const updateGeneral = async (req, res) => {
    const {username, oldImage} = req.body;
    const decoded = jwt_decode(req.cookies.accessToken);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({errors: errors.array()});
    }

    try {
        if (req.file) {
            if (oldImage != "default.jpg") {
                fs.unlinkSync(`public/images/profiles/${oldImage}`);
            }
            await User.update(
                {image: req.file.filename},
                {
                    where: {
                        id: decoded.userId,
                    },
                }
            );
        }

        await User.update(
            {username},
            {
                where: {
                    id: decoded.userId,
                },
            }
        );

        return res.status(201).json({msg: "Profile berhasil diupdate"});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const updateStudent = async (req, res) => {
    const {username, gender, placeOfBirth, birthDay, noHp, nisn, studyAt, province, oldImage} = req.body;
    const decoded = jwt_decode(req.cookies.accessToken);
    const convertBirthDay = new Date(birthDay);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({errors: errors.array()});
    }

    try {
        if (req.file) {
            if (oldImage != "default.jpg") {
                fs.unlinkSync(`public/images/profiles/${oldImage}`);
            }
            await User.update(
                {image: req.file.filename},
                {
                    where: {
                        id: decoded.userId,
                    },
                }
            );
        }

        await User.update(
            {
                username,
                gender,
                placeOfBirth,
                birthDay: convertBirthDay,
                noHp,
                nisn,
                studyAt,
                province,
            },
            {
                where: {
                    id: decoded.userId,
                },
            }
        );

        return res.status(201).json({msg: "Profile berhasil diupdate"});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

// const test = (req, res) => {
//     console.log(req.cookies.accessToken);
//     const decoded = jwt_decode(req.cookies.accessToken);
//     console.log(decoded);
// };

module.exports = {validateStudent, getProfile, getAllPost, updateGeneral, updateStudent, getMyProfile, getAllEbook};
