const {Follow, User} = require("../models");
const {Sequelize, Op} = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: 5432,
    dialect: process.env.DB_DIALECT,
    logging: false,
});

const getAllTopUser = async (req, res) => {
    try {
        const topUser = await Follow.findAll({
            attributes: [
                ["following", "userId"],
                [sequelize.fn("COUNT", sequelize.col("following")), "follower"],
            ],
            include: [
                {
                    model: User,
                    as: "followingId",
                    attributes: ["id", "username", "image"],
                },
            ],
            group: ["Follow.following", "followingId.id"],
            limit: 50,
        });

        return res.status(200).json({topUser});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

module.exports = {getAllTopUser};
