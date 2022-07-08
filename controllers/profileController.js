require("dotenv").config();
const {validationResult} = require("express-validator");
const {User, Role, Post, PostCategory, PostFile} = require("../models");
const fs = require("fs");
const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");

const getMyProfile = async (req, res) => {
    const decoded = jwt_decode(req.cookies.accessToken);
    const user = await User.findOne({where: {id: decoded.userId}});

    if (!user) return res.sendStatus(404);

    return res.status(200).json({user});
};

const getProfile = async (req, res) => {
    const id = req.params.id;
    const user = await User.findOne({where: {id}});

    if (!user) return res.sendStatus(404);

    return res.status(200).json({user});
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
            return res.status(404).json({msg: "Tidak ada postingan"});
        }

        return res.status(200).json({posts});
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

const validateStudent = async (req, res) => {
    const {username, gender, placeOfBirth, birthDay, noHp, studentCard, email, nisn, studyAt, province} = req.body;
    const convertBirthDay = new Date(birthDay);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const regex = /^data:.+\/(.+);base64,(.*)$/;
    const matches = studentCard.match(regex);
    const ext = matches[1];
    const data = matches[2];
    const buffer = Buffer.from(data, "base64");
    const fileName = `${Date.now()}.${ext}`;
    fs.writeFileSync(`./public/images/studentCard/${fileName}`, buffer);

    try {
        await User.update(
            {
                roleId: 2,
                username,
                gender,
                placeOfBirth,
                birthDay: convertBirthDay,
                noHp,
                studentCard: fileName,
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

module.exports = {validateStudent, getProfile, getAllPost, updateGeneral, updateStudent, getMyProfile};
