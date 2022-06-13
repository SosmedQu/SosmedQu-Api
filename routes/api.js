const express = require("express");
const {User, Role} = require("../models");

const router = express.Router();

// router.route("/").get(doSomething()).post(doSomething());
// router.route("/").put(doSOmething()).delete(doSomething());

router.get("/", async (req, res) => {
    // const rahmat = await User.create({
    //     roleId: 1,
    //     postId: 1,
    //     statusId: 1,
    //     username: "rahmat",
    //     email: "rahmat@gmail.com",
    //     password: "12345",
    //     gender: "male",
    //     birthDat: "19-08-2002",
    //     noHp: 1923171,
    //     studentCard: "student",
    //     nisn: 001231,
    //     studyAt: "ubsi",
    // });
    // const role = await Role.create({
    //     roleName: "pelajar",
    // });

    const user = await User.findOne({
        include: {
            model: Role,
        },
    });

    console.log(user);
});

router.get("/registrasi", (req, res) => {
    res.send("Register");
});

module.exports = router;
