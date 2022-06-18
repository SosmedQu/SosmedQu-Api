require("dotenv").config();
const {validationResult} = require("express-validator");
const {UserToken, User} = require("../models");

const validateStudent = async (req, res) => {
    const {username, gender, placeOfBirth, birthDay, noHp, email, studentCard, nisn, studyAt, province} = req.body;
};

module.exports = {validateStudent};
