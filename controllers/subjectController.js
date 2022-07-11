const {validationResult} = require("express-validator");
const {User, LessonTimetable, Day} = require("../models");
const jwt_decode = require("jwt-decode");
const fs = require("fs");
const {Op} = require("sequelize");

const getSubjects = async (req, res) => {
    const decoded = jwt_decode(req.cookies.accessToken);

    try {
        const subjects = await LessonTimetable.findAll({
            where: {userId: decoded.userId},
            attributes: ["dayId"],
            include: [
                {
                    model: Day,
                    attributes: ["id", "day", "createdAt", "updatedAt"],
                },
            ],
            group: ["Day.id", "dayId"],
            order: [["dayId", "ASC"]],
        });

        if (subjects.length == 0) return res.status(404).json({msg: "Not Found"});

        return res.status(200).json({subjects});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const createSubject = async (req, res) => {
    const {subject, dayId, hour, teacher, class: kelas, semester} = req.body;
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
            dayId,
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

const getSubject = async (req, res) => {
    const id = req.params.id;

    try {
        const subjects = await LessonTimetable.findOne({
            where: {id},
            include: [
                {
                    model: User,
                    attributes: ["id", "username", "image"],
                },
                {
                    model: Day,
                    attributes: ["day"],
                },
            ],
        });

        if (!subjects) return res.status(200).json({msg: "Not Found"});

        return res.status(200).json({subjects});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const getSubjectByDayId = async (req, res) => {
    const dayId = req.params.id;
    const decoded = jwt_decode(req.cookies.accessToken);

    try {
        const subjects = await LessonTimetable.findAll({
            where: {[Op.and]: [{userId: decoded.userId}, {dayId}]},
            include: [
                {
                    model: User,
                    attributes: ["id", "username", "image"],
                },
                {
                    model: Day,
                    attributes: ["day"],
                },
            ],
            order: [["hour", "ASC"]],
        });

        if (!subjects) return res.status(200).json({msg: "Not Found"});

        return res.status(200).json({subjects});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const updateSubject = async (req, res) => {
    const {id, subject, dayId, hour, teacher, class: kelas, semester, oldImage} = req.body;
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
        {image: req.file?.filename || "default.jpg", subject, dayId, hour, teacher, class: kelas, semester},
        {
            where: {
                id,
            },
        }
    );

    return res.status(200).json({msg: "Jadwal mata pelajaran berhasil diupdate"});
};

const deleteSubject = async (req, res) => {
    const id = req.params.id;

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

module.exports = {getSubjects, createSubject, getSubject, getSubjectByDayId, updateSubject, deleteSubject};
