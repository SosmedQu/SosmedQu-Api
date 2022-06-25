const express = require("express");
const authController = require("../controllers/authController");
const profileController = require("../controllers/profileController");
const postController = require("../controllers/postController");
const {verifyToken} = require("../middleware/verifyToken");
const {check, body, validationResult} = require("express-validator");
const router = express.Router();
const multer = require("multer");
const profileFilesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images/profiles");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});
const profileUpload = multer({
    storage: profileFilesStorage,
});
const postFilesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images/posts");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});
const postUpload = multer({
    storage: postFilesStorage,
});

//? ENDPOINT API AUTHENTICATION
router.post("/auth/register", [check("email", "Email tidak boleh kosong").trim().isLength({min: 1}), check("email", "Email tidak valid").isEmail()], authController.register);
router.post("/auth/verifyAccount", authController.verifyAccount);
router.post("/auth/resendEmail", authController.resendEmail);
router.post(
    "/auth/createPassword",
    [
        check("username", "Username harus diisi").trim().isLength({min: 1}),
        check("password", "Password harus minimal 8 karakter").trim().isLength({min: 8}),
        check("confirmPassword", "Konfirmasi password tidak sesuai").custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error("Konfirmasi password tidak sesuai");
            }
            return true;
        }),
    ],
    authController.createPassword
);
router.post(
    "/auth/login",
    [check("email", "Email harus diisi").trim().isLength({min: 1}), check("email", "Email tidak valid").isEmail(), check("password", "Password harus minimal 8 karakter").trim().isLength({min: 8})],
    authController.login
);
router.post("/auth/forgotPassword", [check("email", "Email harus diisi").trim().isLength({min: 1}), check("email", "Email tidak valid").isEmail()], authController.forgotPassword);
router.post("/auth/resetPassword", authController.resetPassword);
router.post(
    "/auth/changePassword",
    [
        check("password", "Password harus minimal 8 karakter").trim().isLength({min: 8}),
        check("newPassword", "Konfirmasi password tidak sesuai").custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error("Konfirmasi password tidak sesuai");
            }
            return true;
        }),
    ],
    authController.changePassword
);
router.get("/auth/logout", verifyToken, authController.logout);
//? END OF ENDPOINT API AUTHENTICATION

//? ENDPOINT API PROFILE
router.post(
    "/profile/validateStudent",
    verifyToken,
    profileUpload.single("studentCard"),
    [
        check("studentCard").custom((value, {req}) => {
            if (!req.file) {
                throw new Error("Kartu pelajar wajib diupload");
            }
            return true;
        }),
        check("studentCard").custom((value, {req}) => {
            if (req.file) {
                if (req.file.mimetype != "image/png" && req.file.mimetype != "image/jpg" && req.file.mimetype != "image/jpeg") {
                    throw new Error("Hanya format .png, .jpg, dan .jpeg yang bisa diupload");
                }
            }
            return true;
        }),
        check("studentCard").custom((value, {req}) => {
            if (req.file) {
                if (req.file.size > 5000000) {
                    throw new Error("Maksimal ukuran file yang diupload tidak lebih dari 5 Mb");
                }
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
//? END OF ENDPOINT API AUTHENTICATION

//? ENDPOINT API POSTS
router.get("/posts", verifyToken, postController.getAllPosts);
router.post("/posts", verifyToken, postUpload.array("postFiles"), [check("caption", "Caption harus diisi").exists().trim().isLength({min: 1})], postController.createPost);
router.get("/posts/edit/:id", verifyToken, postController.editPost);
router.put("/posts", verifyToken, postUpload.array("postFiles"), postController.updatePost);
router.delete("/posts", verifyToken, postController.deletePost);

module.exports = router;
