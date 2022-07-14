const {Like, User, Chatting} = require("../models");
const jwt_decode = require("jwt-decode");
const {Sequelize, Op} = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: 5432,
    dialect: process.env.DB_DIALECT,
    logging: false,
});

const getAllMyChatting = async (req, res) => {
    const decoded = jwt_decode(req.cookies.accessToken);

    try {
        const chattings = await Chatting.findAll({
            where: {to: decoded.userId},
            attributes: ["from", [Sequelize.fn("COUNT", "from"), "total_chat"]],
            include: [
                {
                    model: User,
                    as: "sender",
                    attributes: [],
                    where: {
                        id: {
                            [Op.col]: "Chatting.from",
                        },
                    },
                },
            ],
            group: ["from"],
        });

        return res.status(200).json({chattings});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const getAllUserChat = async (req, res) => {
    const id = req.params.id;
    const decoded = jwt_decode(req.cookies.accessToken);

    try {
        const chattings = await Chatting.findAll({
            where: {
                [Op.or]: [
                    {from: decoded.userId, to: id},
                    {from: id, to: decoded.userId},
                ],
            },
            include: [
                {
                    model: User,
                    as: "sender",
                    where: {
                        id: {
                            [Op.col]: "Chatting.from",
                        },
                    },
                    attributes: ["id", "username", "image"],
                },
                {
                    model: User,
                    as: "receiver",
                    where: {
                        id: {
                            [Op.col]: "Chatting.to",
                        },
                    },
                    attributes: ["id", "username", "image"],
                },
            ],
            order: [["id", "DESC"]],
        });

        if (chattings.length == 0) return res.status(200).json({msg: "Not Found"});

        return res.status(200).json({chattings});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const createUserChat = async (req, res) => {
    const {from, to, message} = req.body;
    const decoded = jwt_decode(req.cookies.accessToken);

    try {
        await Chatting.create({from: decoded.userId, to, message, status: 0});

        return res.sendStatus(201);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

module.exports = {getAllMyChatting, getAllUserChat, createUserChat};
