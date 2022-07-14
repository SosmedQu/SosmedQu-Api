const {Like, User} = require("../models");
const jwt_decode = require("jwt-decode");
const {Sequelize, Op} = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: 5432,
    dialect: process.env.DB_DIALECT,
    logging: false,
});

const getAllLike = async (req, res) => {
    const id = req.params.id;

    try {
        const likes = await Like.findAll({
            include: [
                {
                    model: User,
                    attributes: ["id", "username", "image"],
                },
            ],
        });

        return res.status(200).json({likes});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const createLike = async (req, res) => {
    const {postId} = req.body;
    const decoded = jwt_decode(req.cookies.accessToken);

    try {
        const checkLike = await Like.findOne({
            where: {[Op.and]: [{postId}, {userId: decoded.userId}]},
        });

        if (checkLike) return res.status(403).json({msg: "Forbidden"});

        await Like.create({postId, userId: decoded.userId});

        return res.sendStatus(201);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

module.exports = {getAllLike, createLike};
