const express = require("express");
const authController = require("../controllers/authController");
const profileController = require("../controllers/profileController");
const {verifyToken} = require("../middleware/verifyToken");
const {check, body} = require("express-validator");
const router = express.Router();
const multer = require("multer");
const profileFileStorange = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images/profiles");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});
const maxSize = 1 * 1024 * 1024; // 1MB
const profileUpload = multer({
    storage: profileFileStorange,
});

// router.route("/").get(doSomething()).post(doSomething());
// router.route("/").put(doSOmething()).delete(doSomething());

router.post("/register", [check("email", "Email tidak boleh kosong").trim().isLength({min: 1}), check("email", "Email tidak valid").isEmail()], authController.register);

router.get("/verifyAccount", authController.verifyAccount);
router.post("resendEmail", authController.resendEmail);

router.post(
    "/createPassword",
    [
        check("username", "Username tidak boleh kosong").trim().isLength({min: 1}),
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

router.post(
    "/validateStudent",
    verifyToken,
    profileUpload.single("studentCard"),
    [
        check("studentCard").custom((value, {req}) => {
            if (req.file.mimetype != "image/png" && req.file.mimetype != "image/jpg" && req.file.mimetype != "image/jpeg") {
                throw new Error("Hanya format .png, .jpg, dan .jpeg yang bisa diupload");
            }
            return true;
        }),
        check("studentCard").custom((value, {req}) => {
            if (req.file.size > 5000000) {
                throw new Error("Maksimal ukuran file yang diupload tidak lebih dari 5 Mb");
            }
            return true;
        }),
        check("username", "Username harus diisi").exists().trim().isLength({min: 1}),
        check("gender", "Jenis kelamin harus diisi").exists().trim().isLength({min: 1}),
        check("placeOfBirth", "Tempat lahir harus diisi").exists().trim().isLength({min: 1}),
        check("placeOfBirth", "Tempat lahir harus diisi").exists().trim().isLength({min: 1}),
        check("birthDay", "Tanggal lahir harus diisi").exists().trim().isLength({min: 1}),
        check("noHp", "No Handphone harus diisi").exists().trim().isLength({min: 1}),
        check("noHp", "No Handphone tidak valid").isMobilePhone("id-ID"),
        check("nisn", "NISN harus diisi").exists().trim().isLength({min: 1}),
        check("studyAt", "Asal Sekolah / Perguruan tinggi harus diisi").exists().trim().isLength({min: 1}),
        check("province", "Provinsi harus diisi").exists().trim().isLength({min: 1}),
    ],

    profileController.validateStudent
);

module.exports = router;
