const {validationResult} = require("express-validator");
const {User, PersonalNote, LabelNote} = require("../models");
const jwt_decode = require("jwt-decode");

const getAllNotes = async (req, res) => {
    const decoded = jwt_decode(req.cookies.accessToken);

    try {
        const notes = await PersonalNote.findAll({
            where: {userId: decoded.userId},
            include: [
                {
                    model: LabelNote,
                },
            ],
            order: [["id", "DESC"]],
        });

        if (notes.length == 0) return res.status(404).json({msg: "Not Found"});

        return res.status(200).json({notes});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const createNote = async (req, res) => {
    const decoded = jwt_decode(req.cookies.accessToken);
    const {labelName, color, title, description} = req.body;

    try {
        const labelNote = await LabelNote.create({labelName, color});
        await PersonalNote.create({
            userId: decoded.userId,
            labelId: labelNote.id,
            title,
            description,
        });

        return res.status(201).json({msg: "Catatan pribadi berhasil diupload"});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const updateNote = async (req, res) => {
    const {labelName, color, title, description, id} = req.body;

    try {
        const note = await PersonalNote.findOne({
            where: {id},
            include: [
                {
                    model: LabelNote,
                },
            ],
        });

        await PersonalNote.update(
            {title, description},
            {
                where: {
                    id,
                },
            }
        );

        await LabelNote.update(
            {labelName, color},
            {
                where: {
                    id: note.LabelNote.id,
                },
            }
        );

        return res.status(201).json({msg: "Catatan pribadi berhasil diupdate"});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const getNote = async (req, res) => {
    const id = req.params.id;

    try {
        const note = await PersonalNote.findOne({
            where: {id},
            include: [
                {
                    model: LabelNote,
                },
            ],
        });

        if (!note) {
            return res.status(404).json({msg: "Not Found"});
        }

        return res.status(200).json({note});
    } catch (err) {
        console.log(err);
        return res.status(500);
    }
};

const deleteNote = async (req, res) => {
    const id = req.params.id;

    const note = await PersonalNote.findOne({
        where: {id},
        include: [
            {
                model: LabelNote,
            },
        ],
    });

    await PersonalNote.destroy({
        where: {
            id,
        },
    });

    await LabelNote.destroy({
        where: {
            id: note.LabelNote.id,
        },
    });

    return res.status(200).json({msg: "Catatan pribadi berhasil dihapus"});
};

module.exports = {getAllNotes, createNote, updateNote, getNote, deleteNote};
