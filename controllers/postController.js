const {validationResult} = require("express-validator");
const {User, Post, PostCategory, PostFile} = require("../models");

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

const createPost = async (req, res) => {};

const updatePost = async (req, res) => {};

const deletePost = async (req, res) => {};

module.exports = {getAllPosts, createPost, updatePost, deletePost};
