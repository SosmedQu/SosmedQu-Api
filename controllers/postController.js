const {validationResult} = require("express-validator");
const {User, Post, PostCategory, PostFile} = require("../models");
const jwt_decode = require("jwt-decode");
const fs = require("fs");

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [
                {
                    model: PostCategory,
                },
                {
                    model: User,
                },
            ],
        });

        const postFiles = await PostFile.findAll();
        return res.status(200).json({posts, postFiles});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const createPost = async (req, res) => {
    const {caption, privacy, categoryId} = req.body;
    const decoded = jwt_decode(req.cookies.accessToken);
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

        return res.status(200).json({success: true});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const editPost = async (req, res) => {
    const id = req.params.id;

    try {
        const post = await Post.findOne({where: {id}});
        const postFiles = await PostFile.findAll({where: {postId: id}});

        return res.status(200).json({post, postFiles});
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

    if (req.files.length != 0) {
        if (oldFiles) {
            await PostFile.destroy({
                where: {
                    postId: id,
                },
            });

            oldFiles.forEach(async (file) => {
                fs.unlinkSync(`images/posts/${file}`);
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

    return res.status(200).json({msg: "Berhasil update"});
};

const deletePost = async (req, res) => {
    const {id} = req.body;

    try {
        await Post.destroy({
            where: {
                id,
            },
        });

        const postFiles = await PostFile.findAll({where: {postId: id}});

        postFiles.forEach((file) => {
            fs.unlinkSync(`images/posts/${file.fileName}`);
        });

        await PostFile.destroy({
            where: {
                postId: id,
            },
        });

        return res.status(200).json({success: true});
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

module.exports = {getAllPosts, createPost, updatePost, deletePost, editPost};
