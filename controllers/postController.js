const {validationResult} = require("express-validator");
const {User, Post, PostCategory, PostFile, Like} = require("../models");
const jwt_decode = require("jwt-decode");
const fs = require("fs");
const {Sequelize, Op} = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: 5432,
    dialect: process.env.DB_DIALECT,
    logging: false,
});

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: {statusId: {[Op.ne]: 0}},
            include: [
                {
                    model: PostCategory,
                },
                {
                    model: User,
                    attributes: ["id", "username", "image", "studyAt"],
                },
                {
                    model: PostFile,
                },
                {
                    model: Like,
                },
            ],
            order: [["id", "DESC"]],
        });

        return res.status(200).json({posts});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const postDetail = async (req, res) => {
    const id = req.params.id;

    try {
        const post = await Post.findOne({
            where: {id},
            include: [
                {
                    model: PostCategory,
                },
                {
                    model: User,
                    attributes: ["id", "username", "image", "studyAt"],
                },
                {
                    model: PostFile,
                },
            ],
        });

        if (!post) {
            return res.status(404).json({msg: "Post Not Found"});
        }

        return res.status(200).json({post});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const createPost = async (req, res) => {
    const {caption, privacy, categoryId} = req.body;
    const decoded = jwt_decode(req.cookies.accessToken);
    const errors = validationResult(req);
    const user = await User.findOne({where: {id: decoded.userId}});

    if (!errors.isEmpty()) {
        if (req.files) {
            req.files.forEach(function (file) {
                fs.unlinkSync(file.path);
            });
        }
        return res.status(400).json({errors: errors.array()});
    }

    if (!user || user.statusId == 0 || user.roleId == 3) {
        if (req.files) {
            req.files.forEach(function (file) {
                fs.unlinkSync(file.path);
            });
        }
        return res.status(401).json({msg: "Unauthorized"});
    }

    try {
        const post = await Post.create({
            userId: decoded.userId,
            categoryId,
            caption,
            privacy,
        });

        if (req.files) {
            req.files.forEach((file) => {
                PostFile.create({postId: post.id, fileName: file.filename});
            });
        }

        return res.status(201).json({msg: "Postingan Berhasil Dibuat"});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const updatePost = async (req, res) => {
    const {id, caption, privacy, categoryId, oldFiles} = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        if (req.files) {
            req.files.forEach(function (file) {
                fs.unlinkSync(file.path);
            });
        }
        return res.status(400).json({errors: errors.array()});
    }

    try {
        if (req.files.length != 0) {
            if (oldFiles) {
                await PostFile.destroy({
                    where: {
                        postId: id,
                    },
                });

                oldFiles.forEach(async (file) => {
                    fs.unlinkSync(`public/images/posts/${file}`);
                });

                req.files.forEach((file) => {
                    PostFile.create({postId: id, fileName: file.filename});
                });
            } else {
                req.files.forEach((file) => {
                    PostFile.create({postId: id, fileName: file.filename});
                });
            }
        }

        await Post.update(
            {caption, privacy, categoryId},
            {
                where: {
                    id,
                },
            }
        );

        return res.status(201).json({msg: "Berhasil update"});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const deletePost = async (req, res) => {
    const id = req.params.id;
    const decoded = jwt_decode(req.cookies.accessToken);

    try {
        const post = await Post.findOne({where: {id}});
        if (post.userId != decoded.userId) {
            return res.status(403).json({msg: "Forbiden"});
        }

        await Post.destroy({
            where: {
                id,
            },
        });

        const postFiles = await PostFile.findAll({where: {postId: id}});

        if (postFiles) {
            postFiles.forEach((file) => {
                fs.unlinkSync(`public/images/posts/${file.fileName}`);
            });

            await PostFile.destroy({
                where: {
                    postId: id,
                },
            });
        }

        return res.status(200).json({msg: "Postingan Berhasil Dihapus"});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

module.exports = {getAllPosts, createPost, updatePost, deletePost, postDetail};
