require("dotenv").config();
const {validationResult} = require("express-validator");
const {User} = require("../models");
const fs = require("fs");

const validateStudent = async (req, res) => {
    const {username, gender, placeOfBirth, birthDay, noHp, email, nisn, studyAt, province} = req.body;
    const convertBirthDay = new Date(birthDay);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({errors: errors.array()});
    }

    const encodeImage = fs.readFileSync(req.file.path, "base64");

    await User.update(
        {
            username,
            gender,
            placeOfBirth,
            birthDay: convertBirthDay,
            noHp,
            studentCard: encodeImage,
            nisn,
            studyAt,
            province,
        },
        {
            where: {
                email: "rahmatfauzi841@gmail.com",
            },
        }
    );

    return res.status(200).json({msg: "Validasi siswa berhasil"});
};

module.exports = {validateStudent};
