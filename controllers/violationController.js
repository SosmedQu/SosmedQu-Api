const {User, Violation, Post, PostFile, PostCategory, Status} = require("../models");
const jwt_decode = require("jwt-decode");

const getAllPostViolation = async (req, res) => {
    try {
        const violations = await Violation.findAll({
            where: {feature: "post"},
            include: [
                {
                    model: Post,
                    include: [
                        {
                            model: User,
                            attributes: ["id", "username", "image"],
                        },
                        {
                            model: PostFile,
                        },
                        {
                            model: PostCategory,
                        },
                    ],
                },
            ],
        });

        if (violations.length == 0) return res.status(404).json({msg: "Not Found"});

        return res.status(200).json({violations});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const getAllUserViolation = async (req, res) => {
    try {
        const violations = await Violation.findAll({
            where: {feature: "user"},
            include: [
                {
                    model: User,
                },
            ],
        });

        if (violations.length == 0) return res.status(404).json({msg: "Not Found"});

        return res.status(200).json({violations});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const createViolation = async (req, res) => {
    const {feature, featureId, description} = req.body;

    try {
        if (feature == "post") {
            await Post.update(
                {statusId: 2},
                {
                    where: {
                        id: featureId,
                    },
                }
            );
        } else if (feature == "user") {
            await User.update(
                {statusId: 2},
                {
                    where: {
                        id: featureId,
                    },
                }
            );
        }

        const violation = await Violation.create({feature, featureId, description});

        if (req.cookies.accessToken) {
            const decoded = jwt_decode(req.cookies.accessToken);

            await Violation.update(
                {reporter: decoded.userId},
                {
                    where: {
                        id: violation.id,
                    },
                }
            );
        }

        return res.status(201).json({msg: "Laporan berhasil dikirim"});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const block = async (req, res) => {
    const {feature, featureId} = req.body;

    try {
        if (feature == "post") {
            await Post.update(
                {statusId: 0},
                {
                    where: {
                        id: featureId,
                    },
                }
            );

            return res.status(200).json({msg: "Postingan berhasil di block"});
        } else if (feature == "user") {
            await User.update(
                {statusId: 0},
                {
                    where: {
                        id: featureId,
                    },
                }
            );
            return res.status(200).json({msg: "User berhasil di banned"});
        }
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const activate = async (req, res) => {
    const {feature, featureId, id} = req.body; // id ini id di tabel violations

    try {
        if (feature == "post") {
            await Post.update(
                {statusId: 1},
                {
                    where: {
                        id: featureId,
                    },
                }
            );
        } else if (feature == "user") {
            await User.update(
                {statusId: 1},
                {
                    where: {
                        id: featureId,
                    },
                }
            );
        }

        await Violation.destroy({
            where: {
                id,
            },
        });

        return res.status(200).json({msg: "Berhasil di aktifkan"});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

// const deleteViolation = async (req, res) => {
//     const id = req.params.id;

//     try {
//         await Violation.destroy({
//             where: {
//                 id,
//             },
//         });

//         return res.status(200).json({msg: "Report berhasil dihapus"});
//     } catch (err) {
//         console.log(err);
//         return res.sendStatus(500);
//     }
// };

module.exports = {getAllPostViolation, createViolation, getAllUserViolation, block, activate};
