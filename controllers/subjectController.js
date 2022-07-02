const {validationResult} = require("express-validator");
const {User, LessonTimetable} = require("../models");
const jwt_decode = require("jwt-decode");
const fs = require("fs");

const getSubjects = async (req, res) => {
    const decoded = jwt_decode(req.cookies.accessToken);

    try {
        const subjects = await LessonTimetable.findAll({
            where: {userId: decoded.userId},
            include: [
                {
                    model: User,
                    attributes: ["username"],
                },
            ],
        });

        return res.status(200).json({subjects});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const createSubject = async (req, res) => {
    const {subject, day, hour, teacher, class: kelas, semester} = req.body;
    const decoded = jwt_decode(req.cookies.accessToken);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({errors: errors.array()});
    }

    try {
        await LessonTimetable.create({
            userId: decoded.userId,
            image: req.file?.filename || "default.jpg",
            subject,
            day,
            hour,
            teacher,
            class: kelas,
            semester,
        });

        return res.status(200).json({msg: "Jadwal pelajaran berhasil diupload"});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const editSubject = async (req, res) => {
    const {id} = req.params.id;

    try {
        const subjects = await LessonTimetable.findOne({
            where: {id},
            include: [
                {
                    model: User,
                    attributes: ["username"],
                },
            ],
        });

        return res.status(200).json({subjects});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const updateSubject = async (req, res) => {
    const {id, subject, day, hour, teacher, class: kelas, semester, oldImage} = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({errors: errors.array()});
    }

    if (req.file) {
        if (oldImage != "default.jpg") {
            fs.unlinkSync(`public/images/subjects/${oldImage}`);
        }
    }

    await LessonTimetable.update(
        {image: req.file.filename || "default.jpg", subject, day, hour, teacher, class: kelas, semester},
        {
            where: {
                id,
            },
        }
    );

    return res.status(200).json({msg: "Jadwal mata pelajaran berhasil diupdate"});
};

const deleteSubject = async (req, res) => {
    const {id} = req.body;

    try {
        const subject = await LessonTimetable.findOne({where: {id}, attributes: ["image"]});
        await LessonTimetable.destroy({
            where: {
                id,
            },
        });

        if (subject.image != "default.jpg") {
            fs.unlinkSync(`public/images/subjects/${subject.image}`);
        }

        return res.status(200).json({msg: "Jadwal Pelajaran Berhasil Dihapus"});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

module.exports = {getSubjects, createSubject, editSubject, updateSubject, deleteSubject};
