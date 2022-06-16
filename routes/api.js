const express = require("express");
const authController = require("../controllers/authController");
const {check} = require("express-validator");

const router = express.Router();

// router.route("/").get(doSomething()).post(doSomething());
// router.route("/").put(doSOmething()).delete(doSomething());

router.post("/register", [check("email", "Email tidak boleh kosong").trim().isLength({min: 1}), check("email", "Email tidak valid").isEmail()], authController.register);

router.get("/verifyAccount", authController.verifyAccount);
router.post("resendEmail", authController.resendEmail);

router.post(
    "/createPassword",

    [
        check("password", "Password harus minimal 8 karakter").trim().isLength({min: 8}),
        check("password", "Konfirmasi password tidak sesuai").custom((value, {req}) => {
            if (value !== req.body.confirmPassword) {
                throw new Error("Konfirmasi password tidak sesuai");
            }
            return true;
        }),
    ],
    authController.createPassword
);

module.exports = router;
