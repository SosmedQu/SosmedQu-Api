const {Day} = require("../models");

const getAllDay = async (req, res) => {
    try {
        const days = await Day.findAll({
            attributes: ["id", "day"],
        });

        if (days.length == 0) return res.status(404), json({msg: "Not Found"});

        return res.status(200).json({days});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

module.exports = {getAllDay};
