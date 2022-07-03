require("dotenv").config();
const {validationResult} = require("express-validator");
const {User, Post, PostCategory, PostFile} = require("../models");
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

module.exports = {validateStudent, getProfile, getAllPost};
