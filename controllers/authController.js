require("dotenv").config();
const {validationResult} = require("express-validator");
const nodemailer = require("nodemailer");
const {UserToken, User} = require("../models");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "rahmatfauzi.w@gmail.com",
        pass: "geszgjkqeibswdeg",
    },
});

const register = async (req, res) => {
    const {email, link} = req.body;
    const errors = validationResult(req);
    const token = crypto.randomBytes(64).toString("base64url");
    let mailOptions = {
        from: "rahmatfauzi.w@gmail.com",
        to: email,
        subject: "Account Verification",
        html: `Click this link to verify your account : <a href="${link}?email=${email}&token=${token}">Activate</a>`,
    };

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const user = await User.findOne({where: {email: email}});

        if (user) {
            if (user.statusId === 0) {
                return res.status(400).json({msg: "Email tidak bisa digunakan karena melanggar aturan"});
            } else if (user.statusId === 1) {
                if (user.password != null) return res.status(404).json({msg: "Email sudah terdaftar"});

                transporter.sendMail(mailOptions, async (err, info) => {
                    if (err) return res.status(400).json({msg: "Gagal mengirim email"});

                    const userToken = await UserToken.create({email: email, token: token});

                    return res.status(200).json({msg: "Verifikasi Berhasil Dikirim ke Email Anda"});
                });
            }
        }

        const checkUserToken = await UserToken.findOne({where: {email: email}});
        if (checkUserToken) {
            await UserToken.destroy({
                where: {
                    email: email,
                },
            });
        }

        transporter.sendMail(mailOptions, async (err, info) => {
            if (err) return res.status(400).json({msg: "Gagal mengirim email"});

            const userToken = await UserToken.create({email: email, token: token});

            return res.status(200).json({msg: "Verifikasi Berhasil Dikirim ke Email Anda"});
        });
    } catch (err) {
        console.log(err);
    }
};

const verifyAccount = async (req, res) => {
    const {token, email} = req.body;

    if (!token || !email) return res.sendStatus(404);

    const checkUserToken = await UserToken.findOne({where: {email: email}});

    if (!checkUserToken) {
        return res.status(404).json({msg: "Email tidak ditemukan"});
    }

    if (checkUserToken.token !== token) {
        return res.status(400).json({msg: "token salah"});
    }

    const user = await User.create({email: email, statusId: 1, roleId: 3});
    await UserToken.destroy({
        where: {
            email: email,
        },
    });

    return res.status(200).json({msg: "Email telah diverifikasi"});
};

const resendEmail = async (req, res) => {
    const {email, link} = req.body;
    const token = crypto.randomBytes(64).toString("base64url");
    let mailOptions = {
        from: "rahmatfauzi.w@gmail.com",
        to: email,
        subject: "Account Verification",
        html: `Click this link to verify your account : <a href="${link}?email=${email}&token=${token}">Activate</a>`,
    };

    const checkUserToken = await UserToken.findOne({where: {email: email}});
    if (checkUserToken) {
        await UserToken.destroy({
            where: {
                email: email,
            },
        });
    }

    transporter.sendMail(mailOptions, async (err, info) => {
        if (err) return res.status(400).json({msg: "Gagal mengirim email"});

        const userToken = await UserToken.create({email: email, token: token});

        return res.status(200).json({msg: "Verifikasi Berhasil Dikirim ke Email Anda"});
    });
};

const createPassword = async (req, res) => {
    const {password, confirmPassword, email, username} = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    try {
        const user = await User.findOne({where: {email}});
        const accessToken = jwt.sign({userId: user.id, username: user.username, email: user.email}, process.env.ACCESS_TOKEN_SECRET);

        await User.update(
            {password: hashPassword, username, accessToken},
            {
                where: {
                    email,
                },
            }
        );

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
        });

        return res.status(200).json({msg: "Password berhasil dibuat", accessToken: accessToken});
    } catch (err) {
        console.log(err);
    }
};

const login = async (req, res) => {
    const {email, password} = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const user = await User.findOne({where: {email}});

        if (!user) return res.status(404).json({msg: "Email / password salah"});

        const match = await bcrypt.compare(password, user.password);

        if (!match) return res.status(400).json({msg: "Email / password salah"});

        const accessToken = jwt.sign({userId: user.id, username: user.username, email}, process.env.ACCESS_TOKEN_SECRET);

        await User.update(
            {accessToken},
            {
                where: {
                    email,
                },
            }
        );

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
        });

        return res.status(200).json({msg: "Berhasil login", accessToken});
    } catch (err) {
        console.log(err);
    }
};

const forgotPassword = async (req, res) => {
    const {email, link} = req.body;
    const errors = validationResult(req);
    const token = crypto.randomBytes(64).toString("base64url");
    let mailOptions = {
        from: "rahmatfauzi.w@gmail.com",
        to: email,
        subject: "Reset Password",
        html: `Click this link to change your password : <a href="${link}?email=${email}&token=${token}">Activate</a>`,
    };

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const user = await User.findOne({where: {email}});
        if (!user) {
            return res.status(404).json({msg: "Email tidak terdaftar"});
        }

        if (user.statusId === 0) {
            return res.status(400).json({msg: "Email tidak bisa digunakan karena melanggar aturan"});
        } else if (user.password == null) {
            return res.status(200).json({msg: "Email belum terverifikasi"});
        } else {
            transporter.sendMail(mailOptions, async (err, info) => {
                if (err) return res.status(400).json({msg: "Gagal mengirim email"});

                await UserToken.create({email: email, token: token});

                return res.status(200).json({msg: "Cek email anda untuk reset password"});
            });
        }
    } catch (err) {
        console.log(err);
    }
};

const resetPassword = async (req, res) => {
    const {token, email} = req.body;

    if (!token || !email) return res.sendStatus(404);

    const checkUserToken = await UserToken.findOne({where: {email: email}});

    if (!checkUserToken) {
        return res.status(404).json({msg: "Email tidak ditemukan"});
    }

    if (checkUserToken.token !== token) {
        return res.status(400).json({msg: "token tidak valid"});
    }

    await UserToken.destroy({
        where: {
            email: email,
        },
    });

    return res.status(200).json({success: true});
};

const changePassword = async (req, res) => {
    const {newPassword, email} = req.body;
    const errors = validationResult(req);
    const salt = await bcrypt.genSalt();

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const hashPassword = await bcrypt.hash(newPassword, salt);

    try {
        await User.update(
            {password: hashPassword},
            {
                where: {
                    email,
                },
            }
        );

        return res.status(200).json({msg: "Password berhasil dibuat"});
    } catch (err) {
        console.log(err);
    }
};

const logout = async (req, res) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) return res.sendStatus(204);

    try {
        const user = await User.findOne({where: {accessToken}});
        if (!user) return res.sendStatus(204);

        await User.update(
            {accessToken: null},
            {
                where: {
                    id: user.id,
                },
            }
        );

        res.clearCookie("accessToken");
        return res.status(200).json({msg: "Berhasil logout"});
    } catch (err) {
        console.log(err);
    }
};

module.exports = {register, verifyAccount, createPassword, resendEmail, login, logout, forgotPassword, changePassword, resetPassword};
