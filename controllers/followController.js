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
    const decoded = jwt_decode(req.cookies.accessToken);
    try {
        const following = await Follow.findAll({
            where: {userId: decoded.userId},
            attributes: [[sequelize.fn("COUNT", sequelize.col("following")), "following"]],
        });

        return res.status(200).json({following});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const getFollower = async (req, res) => {};

const unfollow = async (req, res) => {};

const following = async (req, res) => {};

module.exports = {getFollowing, getFollower, unfollow, following};
