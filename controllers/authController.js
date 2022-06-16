const {validationResult} = require("express-validator");
const nodemailer = require("nodemailer");
const {UserToken, User} = require("../models");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "rahmatfauzi.w@gmail.com",
        pass: "geszgjkqeibswdeg",
    },
});

const register = async (req, res) => {
    const {email} = req.body;
    const errors = validationResult(req);
    const token = crypto.randomBytes(64).toString("base64");
    let mailOptions = {
        from: "rahmatfauzi.w@gmail.com",
        to: email,
        subject: "Account Verification",
        html: `Click this link to verify your account : <a href="http://localhost:3000/api/auth/verifyAccount?email=${email}&token=${token}">Activate</a>`,
    };

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const user = await User.findOne({where: {email: email}});

    if (user) {
        if (user.statusId === 0) {
            return res.status(400).json({msg: "Email tidak bisa digunakan karena melanggar aturan"});
        } else if (user.statusId === 1) {
            return res.status(200).json({msg: "Email sudah terdaftar"});
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
};

const verifyAccount = async (req, res) => {
    const {token, email} = req.query;
    const checkUserToken = await UserToken.findOne({where: {email: email}});

    console.log(checkUserToken.token);
    console.log(token);

    if (!checkUserToken) {
        return res.status(400).json({msg: "email tidak ada"});
    }

    if (checkUserToken.token !== token) {
        return res.status(400).json({msg: "token salah"});
    }

    const user = await User.create({email: email, statusId: 1});
    await UserToken.destroy({
        where: {
            email: email,
        },
    });

    return res.status(200).json({msg: "Email telah diverifikasi"});
};

const resendEmail = async (req, res) => {
    const {email} = req.body;
    let mailOptions = {
        from: "rahmatfauzi.w@gmail.com",
        to: email,
        subject: "Account Verification",
        html: `Click this link to verify your account : <a href="http://localhost:3000/api/auth/verifyAccount?email=${email}&token=${token}">Activate</a>`,
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
        await User.update(
            {password: hashPassword, username: username},
            {
                where: {
                    email: email,
                },
            }
        );

        return res.status(200).json({msg: "Password berhasil dibuat"});
    } catch (err) {
        console.log(err);
    }
};

module.exports = {register, verifyAccount, createPassword, resendEmail};
