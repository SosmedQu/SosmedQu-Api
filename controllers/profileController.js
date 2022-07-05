require("dotenv").config();
const {validationResult} = require("express-validator");
const {User} = require("../models");
const fs = require("fs");
const jwt_decode = require("jwt-decode");

const getProfile = async (req, res) => {
    const decoded = jwt_decode(req.cookies.accessToken);

    const user = await User.findOne({where: {id: decoded.userId}});

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
                    attributes: ["id", "username"],
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
    const {username, gender, placeOfBirth, birthDay, noHp, email, nisn, studyAt, province} = req.body;
    const convertBirthDay = new Date(birthDay);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({errors: errors.array()});
    }

    const studentCard = req.file.filename;

    try {
        await User.update(
            {
                roleId: 2,
                username,
                gender,
                placeOfBirth,
                birthDay: convertBirthDay,
                noHp,
                studentCard,
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

        return res.status(200).json({msg: "Validasi siswa berhasil"});
    } catch (err) {
        console.log(err);
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

module.exports = {validateStudent, getProfile, getAllPost, updateGeneral, updateStudent};
