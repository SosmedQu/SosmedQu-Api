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
const ebookDetail = async (req, res) => {
    const id = req.params.id;

    try {
        const ebook = await Ebook.findOne({
            where: {id},
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

        return res.status(200).json({ebook});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

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

const editEbook = async (req, res) => {
    const id = req.params.id;

    try {
        const ebook = await Ebook.findOne({where: {id}});

        return res.status(200).json({ebook});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const updateEbook = async (req, res) => {
    const {id, categoryId, name, description, writer, publisher, publicationYear, isbn, oldFile, oldImage} = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        if (req.files) {
            fs.unlinkSync(req.files.ebookImage[0].path);
            fs.unlinkSync(req.files.ebookFile[0].path);
        }
        return res.status(400).json({errors: errors.array()});
    }

    try {
        if (Object.getOwnPropertyNames(req.files).length != 0) {
            if (req.files.ebookImage) {
                if (oldImage != "default.jpg") {
                    fs.unlinkSync(`ebooks/images/${oldImage}`);
                    await Ebook.update(
                        {image: req.files.ebookImage[0].filename},
                        {
                            where: {
                                id,
                            },
                        }
                    );
                }
                await Ebook.update(
                    {image: req.files.ebookImage[0].filename},
                    {
                        where: {
                            id,
                        },
                    }
                );
            }

            if (req.files.ebookFile) {
                fs.unlinkSync(`ebooks/files/${oldFile}`);
                await Ebook.update(
                    {fileName: req.files.ebookFile[0].filename},
                    {
                        where: {
                            id,
                        },
                    }
                );
            }
        }

        await Ebook.update(
            {categoryId, name, description, writer, publisher, publicationYear, isbn},
            {
                where: {
                    id,
                },
            }
        );

        return res.status(200).json({msg: "Berhasil update"});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const deleteEbook = async (req, res) => {
    const {id} = req.body;
    console.log(req.body);

    try {
        const ebook = await Ebook.findOne({where: {id}, attributes: ["image", "fileName"]});
        await Ebook.destroy({
            where: {
                id,
            },
        });
        if (ebook.image != "default.jpg") {
            fs.unlinkSync(`ebooks/images/${ebook.image}`);
        }

        fs.unlinkSync(`ebooks/files/${ebook.fileName}`);

        return res.status(200).json({msg: "Ebook Berhasil Dihapus"});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

module.exports = {getAllEbooks, ebookDetail, createEbook, editEbook, updateEbook, deleteEbook};