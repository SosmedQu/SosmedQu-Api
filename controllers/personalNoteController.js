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
        });

        if (notes.length == 0) return res.status(404).json({msg: "Not Found"});

        return res.status(200).json({notes});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const createNote = async (req, res) => {};

const updateNote = async (req, res) => {};

const getNote = async (req, res) => {};

const deleteNote = async (req, res) => {};

module.exports = {getAllNotes, createNote, updateNote, getNote, deleteNote};
