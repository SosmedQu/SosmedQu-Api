require("dotenv").config();
const {Follow, User} = require("../models");
const jwt_decode = require("jwt-decode");
const {Op} = require("sequelize");
const {Sequelize} = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: 5432,
    dialect: process.env.DB_DIALECT,
    logging: false,
});

const getFollowing = async (req, res) => {
    const id = req.params.id;
    try {
        const following = await Follow.findAll({
            where: {userId: id},
            attributes: [],
            include: [
                {
                    model: User,
                    as: "followingId",
                    attributes: ["id", "username", "image"],
                },
            ],
        });

        if (following.length == 0) return res.status(404).json({msg: "Not Found"});

        return res.status(200).json({following});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const getFollower = async (req, res) => {
    const id = req.params.id;
    try {
        const following = await Follow.findAll({
            where: {following: id},
            attributes: [],
            include: [
                {
                    model: User,
                    as: "followerId",
                    attributes: ["id", "username", "image"],
                },
            ],
        });

        if (following.length == 0) return res.status(404).json({msg: "Not Found"});

        return res.status(200).json({following});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const unfollow = async (req, res) => {
    const id = req.params.id;
    const decoded = jwt_decode(req.cookies.accessToken);

    try {
        const deleted = await Follow.destroy({
            where: {[Op.and]: [{userId: decoded.userId}, {following: id}]},
        });

        if (deleted == 0) return res.status(404).json({msg: "Not Found"});

        return res.sendStatus(200);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const following = async (req, res) => {
    const id = req.params.id;
    const decoded = jwt_decode(req.cookies.accessToken);

    try {
        if (id == decoded.userId) return res.status(403).json({msg: "Forbidden"});

        const checkFollow = await Follow.findOne({
            where: {[Op.and]: [{userId: decoded.userId}, {following: id}]},
        });

        if (checkFollow) return res.status(403).json({msg: "Forbidden"});

        await Follow.create({userId: decoded.userId, following: id});

        return res.sendStatus(201);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

module.exports = {getFollowing, getFollower, unfollow, following};
