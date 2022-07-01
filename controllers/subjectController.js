const {validationResult} = require("express-validator");
const {User, Ebook, EbookCategory} = require("../models");
const jwt_decode = require("jwt-decode");

const getSubjects = async (req, res) => {};

const createSubject = async (req, res) => {
    const {} = req.body;
    const decoded = jwt_decode(req.cookies.accessToken);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // if (req.files) {
        //     req.files.forEach(function (file) {
        //         fs.unlinkSync(file.path);
        //     });
        // }
        return res.status(400).json({errors: errors.array()});
    }
};

const editSubject = async (req, res) => {};

const updateSubject = async (req, res) => {};

const deleteSubject = async (req, res) => {};

module.exports = {getSubjects, createSubject, editSubject, updateSubject, deleteSubject};
