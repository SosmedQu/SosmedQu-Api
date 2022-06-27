const {validationResult} = require("express-validator");
const {User, Ebook, EbookCategory} = require("../models");
const jwt_decode = require("jwt-decode");
const fs = require("fs");

const getAllEbooks = async (req, res) => {
    try {
        const ebooks = await Ebook.findAll({
            include: [
                {
                    model: EbookCategory,
                },
                {
                    model: User,
                    attributes: ["username"],
                },
            ],
        });

        return res.status(200).json({ebooks});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};
const ebookDetail = async (req, res) => {};

const createEbook = async (req, res) => {
    const {categoryId, name, description, writer, publisher, publicationYear, isbn} = req.body;
    const decoded = jwt_decode(req.cookies.accessToken);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        if (req.files) {
            fs.unlinkSync(req.files.ebookImage[0].path);
            fs.unlinkSync(req.files.ebookFile[0].path);
        }
        return res.status(400).json({errors: errors.array()});
    }

    await Ebook.create({
        userId: decoded.userId,
        categoryId,
        name,
        image: req.files.ebookImage[0].filename,
        fileName: req.files.ebookFile[0].filename,
        description,
        writer,
        publisher,
        publicationYear,
        isbn,
    });

    return res.status(200).json({msg: "Ebook berhasil diupload"});
};

const updateEbook = async (req, res) => {};

const deleteEbook = async (req, res) => {};

module.exports = {getAllEbooks, ebookDetail, createEbook, updateEbook, deleteEbook};
