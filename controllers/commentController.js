const {Comment, User} = require("../models");
const {Sequelize, Op} = require("sequelize");
const jwt_decode = require("jwt-decode");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: 5432,
    dialect: process.env.DB_DIALECT,
    logging: false,
});

const getAllComment = async (req, res) => {
    const id = req.params.id;

    try {
        const comments = await Comment.findAll({
            where: {postId: id},
            include: [
                {
                    model: User,
                    attributes: ["id", "username", "image"],
                },
            ],
        });

        if (comments.length == 0) return res.status(404).json({msg: "Not Found"});

        return res.status(200).json({comments});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const createComment = async (req, res) => {
    const {postId, message} = req.body;
    const decoded = jwt_decode(req.cookies.accessToken);

    try {
        await Comment.create({postId, userId: decoded.userId, message});

        return res.sendStatus(201);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

module.exports = {getAllComment, createComment};
