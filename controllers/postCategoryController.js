const {validationResult} = require("express-validator");
const {PostCategory} = require("../models");

const getAllCategories = async (req, res) => {
    try {
        const categories = await PostCategory.findAll();

        if (!categories) return res.status(404).json({msg: "Not found"});

        return res.status(200).json({categories});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const createCategory = async (req, res) => {
    const {category} = req.body;

    try {
        await PostCategory.create({category});

        return res.status(200).json({msg: "Kategori postingan berhasil ditambahkan"});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const updateCategory = async (req, res) => {
    const {category, id} = req.body;

    try {
        await PostCategory.update(
            {category},
            {
                where: {
                    id,
                },
            }
        );

        return res.status(200).json({msg: "Kategori postingan berhasil diupdate"});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const getCategory = async (req, res) => {
    const id = req.params.id;

    try {
        const category = await PostCategory.findOne({where: {id}});

        return res.status(200).json({category});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const deleteCategory = async (req, res) => {
    const id = req.params.id;
    console.log(id);

    try {
        await PostCategory.destroy({
            where: {
                id,
            },
        });

        return res.status(200).json({msg: "Kategori berhasil dihapus"});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

module.exports = {getAllCategories, createCategory, updateCategory, getCategory, deleteCategory};
