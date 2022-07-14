const express = require("express");
const authController = require("../controllers/authController");
const profileController = require("../controllers/profileController");
const postController = require("../controllers/postController");
const ebookController = require("../controllers/ebookController");
const subjectController = require("../controllers/subjectController");
const personalNoteController = require("../controllers/personalNoteController");
const schoolController = require("../controllers/schoolController");
const postCategoryController = require("../controllers/postCategoryController");
const ebookCategoryController = require("../controllers/ebookCategoryController");
const followController = require("../controllers/followController");
const dayController = require("../controllers/dayController");
const rankingController = require("../controllers/rankingController");
const violationController = require("../controllers/violationController");
const likeController = require("../controllers/likeController");
const commentController = require("../controllers/commentController");
const {verifyToken} = require("../middleware/verifyToken");
const {isAdmin} = require("../middleware/isAdmin");
const {check} = require("express-validator");
const router = express.Router();
const multer = require("multer");
const profileFilesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/profiles");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});
const profileUpload = multer({
    storage: profileFilesStorage,
});
const studentCardStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/studentCard");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});
const studentCardUpload = multer({
    storage: studentCardStorage,
});
const postFilesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/posts");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});
const postUpload = multer({
    storage: postFilesStorage,
});
const ebookStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "ebookImage") {
            // if uploading resume
            cb(null, "./public/ebooks/images");
        } else {
            // else uploading image
            cb(null, "./public/ebooks/files");
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});
const ebookUpload = multer({
    storage: ebookStorage,
});
const subjectFilesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/subjects");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});
const subjectUpload = multer({
    storage: subjectFilesStorage,
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
router.post("/auth/logout", verifyToken, authController.logout);
//? END OF ENDPOINT API OF AUTHENTICATION

//? ENDPOINT API PROFILE
router.get("/profile", profileController.getMyProfile);
router.get("/profile/posts/:id", profileController.getAllPost);
router.get("/profile/ebooks/:id", profileController.getAllEbook);
router.post(
    "/profile/validateStudent",
    verifyToken,
    studentCardUpload.single("studentCard"),
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
                if (req.file.size > 10000000) {
                    throw new Error("Maksimal ukuran file yang diupload tidak lebih dari 10 Mb");
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
router.put(
    "/profile/general",
    verifyToken,
    profileUpload.single("profileImage"),
    [
        check("profileImage").custom((value, {req}) => {
            if (req.file) {
                if (req.file.mimetype != "image/png" && req.file.mimetype != "image/jpg" && req.file.mimetype != "image/jpeg") {
                    throw new Error("Hanya format .png, .jpg, dan .jpeg yang bisa diupload");
                }
            }
            return true;
        }),
        check("profileImage").custom((value, {req}) => {
            if (req.file) {
                if (req.file.size > 5000000) {
                    throw new Error("Maksimal ukuran file yang diupload tidak lebih dari 5 Mb");
                }
            }
            return true;
        }),
        check("username", "Username harus diisi").exists().trim().isLength({min: 1}),
    ],
    profileController.updateGeneral
);
router.put(
    "/profile/student",
    verifyToken,
    profileUpload.single("profileImage"),
    [
        check("profileImage").custom((value, {req}) => {
            if (req.file) {
                if (req.file.mimetype != "image/png" && req.file.mimetype != "image/jpg" && req.file.mimetype != "image/jpeg") {
                    throw new Error("Hanya format .png, .jpg, dan .jpeg yang bisa diupload");
                }
            }
            return true;
        }),
        check("profileImage").custom((value, {req}) => {
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
    profileController.updateStudent
);
router.get("/profile/:id", profileController.getProfile);

//? END OF ENDPOINT OF API PROFILE

//? ENDPOINT API POSTS
router.get("/posts", postController.getAllPosts);
router.post("/posts", verifyToken, postUpload.array("postFiles"), [check("caption", "Caption harus diisi").exists().trim().isLength({min: 1})], postController.createPost);
router.put("/posts", verifyToken, postUpload.array("postFiles"), postController.updatePost);
router.delete("/posts/:id", verifyToken, postController.deletePost);
router.get("/posts/:id", verifyToken, postController.postDetail);
//? END OF ENDPOINT OF API POSTS

//? ENDPOINT API EBOOKS
router.get("/ebooks", ebookController.getAllEbooks);
router.post(
    "/ebooks",
    verifyToken,
    ebookUpload.fields([
        {
            name: "ebookImage",
        },
        {
            name: "ebookFile",
        },
    ]),
    [
        check("name", "Nama ebook harus diisi").exists().trim().isLength({min: 1}),
        check("description", "Deskripsi ebook harus diisi").exists().trim().isLength({min: 1}),
        check("writer", "Nama penulis harus diisi").exists().trim().isLength({min: 1}),
        check("publisher", "Penerbit harus diisi").exists().trim().isLength({min: 1}),
        check("publicationYear", "Tahun terbit harus diisi").exists().trim().isLength({min: 1}),
        check("isbn", "Isbn harus diisi").exists().trim().isLength({min: 1}),
    ],
    ebookController.createEbook
);
router.put(
    "/ebooks",
    verifyToken,
    ebookUpload.fields([
        {
            name: "ebookImage",
        },
        {
            name: "ebookFile",
        },
    ]),
    [check("name", "Nama ebook harus diisi").exists().trim().isLength({min: 1})],
    ebookController.updateEbook
);
router.delete("/ebooks/:id", verifyToken, ebookController.deleteEbook);
router.get("/ebooks/:id", verifyToken, ebookController.ebookDetail);
//? END OF ENDPOINT OF API EBOOKS

//? ENDPOINT API SUBJECTS
router.get("/subjects", verifyToken, subjectController.getSubjects);
router.post(
    "/subjects",
    verifyToken,
    subjectUpload.single("subjectImage"),
    [
        check("subjectImage").custom((value, {req}) => {
            if (req.file) {
                if (req.file.mimetype != "image/png" && req.file.mimetype != "image/jpg" && req.file.mimetype != "image/jpeg") {
                    throw new Error("Hanya format .png, .jpg, dan .jpeg yang bisa diupload");
                }
            }
            return true;
        }),
        check("subjectImage").custom((value, {req}) => {
            if (req.file) {
                if (req.file.size > 5000000) {
                    throw new Error("Maksimal ukuran file yang diupload tidak lebih dari 5 Mb");
                }
            }
            return true;
        }),
        check("subject", "Mata pelajaran atau matkul harus diisi").exists().trim().isLength({min: 1}),
        check("dayId", "Hari harus diisi").exists().trim().isLength({min: 1}),
        check("hour", "Jam harus diisi").exists().trim().isLength({min: 1}),
        check("teacher", "Nama guru atau dosen harus diisi").exists().trim().isLength({min: 1}),
        check("class", "Kelas harus diisi").exists().trim().isLength({min: 1}),
        check("semester", "Semester harus diisi").exists().trim().isLength({min: 1}),
    ],
    subjectController.createSubject
);
router.put(
    "/subjects",
    verifyToken,
    subjectUpload.single("subjectImage"),
    [
        check("subjectImage").custom((value, {req}) => {
            if (req.file) {
                if (req.file.mimetype != "image/png" && req.file.mimetype != "image/jpg" && req.file.mimetype != "image/jpeg") {
                    throw new Error("Hanya format .png, .jpg, dan .jpeg yang bisa diupload");
                }
            }
            return true;
        }),
        check("subjectImage").custom((value, {req}) => {
            if (req.file) {
                if (req.file.size > 5000000) {
                    throw new Error("Maksimal ukuran file yang diupload tidak lebih dari 5 Mb");
                }
            }
            return true;
        }),
        check("subject", "Mata pelajaran atau matkul harus diisi").exists().trim().isLength({min: 1}),
        check("dayId", "Hari harus diisi").exists().trim().isLength({min: 1}),
        check("hour", "Jam harus diisi").exists().trim().isLength({min: 1}),
        check("teacher", "Nama guru atau dosen harus diisi").exists().trim().isLength({min: 1}),
        check("class", "Kelas harus diisi").exists().trim().isLength({min: 1}),
        check("semester", "Semester harus diisi").exists().trim().isLength({min: 1}),
    ],
    subjectController.updateSubject
);
router.get("/subjects/day/:id", verifyToken, subjectController.getSubjectByDayId);
router.get("/subjects/:id", verifyToken, subjectController.getSubject);
router.delete("/subjects/:id", verifyToken, subjectController.deleteSubject);
//? END OF ENDPOINT OF API SUBJECTS

//? ENDPOINT API POST CATEGORY
router.get("/postCategory", postCategoryController.getAllCategories);
router.post("/postCategory", postCategoryController.createCategory);
router.put("/postCategory", postCategoryController.updateCategory);
router.get("/postCategory/:id", postCategoryController.getCategory);
router.delete("/postCategory/:id", postCategoryController.deleteCategory);
//? END OF ENDPOINT OF API POST CATEGORY

//? ENDPOINT API EBOOK CATEGORY
router.get("/ebookCategory", ebookCategoryController.getAllCategories);
router.post("/ebookCategory", ebookCategoryController.createCategory);
router.put("/ebookCategory", ebookCategoryController.updateCategory);
router.get("/ebookCategory/:id", ebookCategoryController.getCategory);
router.delete("/ebookCategory/:id", ebookCategoryController.deleteCategory);
//? END OF ENDPOINT OF API EBOOK CATEGORY

//? ENDPOINT DAY
router.get("/days", dayController.getAllDay);
//? END OF ENDPOINT OF DAY

//? ENDPOINT API SCHOOL
router.get("/schools", schoolController.getSchool);
router.post("/schools", schoolController.createSchool);
//? END OF ENDPOINT OF API SCHOOL

//? ENDPOINT API PERSONAL NOTE
router.get("/notes", verifyToken, personalNoteController.getAllNotes);
router.post("/notes", verifyToken, personalNoteController.createNote);
router.put("/notes", verifyToken, personalNoteController.updateNote);
router.get("/notes/:id", verifyToken, personalNoteController.getNote);
router.delete("/notes/:id", verifyToken, personalNoteController.deleteNote);
//? END OF ENDPOINT OF API PERSONAL NOTE

//? ENDPOINT API FOLLOW
router.get("/following/:id", followController.getFollowing);
router.get("/followers/:id", followController.getFollower);
router.post("/unfollow/:id", followController.unfollow);
router.post("/following/:id", followController.following);
//? END OF ENDPOINT OF API FOLLOW

//? ENDPOINT API VIOLATION
router.get("/violations/posts", violationController.getAllPostViolation);
router.get("/violations/users", violationController.getAllUserViolation);
router.post("/violations", violationController.createViolation);
router.post("/violations/block", violationController.block);
router.post("/violations/activate", violationController.activate);
// router.delete("/violations/:id", violationController.deleteViolation);
//? END OF ENDPOINT OF API VIOLATION

//? ENDPOINT API RANKINGS
router.get("/rankings", rankingController.getAllTopUser);
//? END OF ENDPOINT OF API RANKINGS

//? ENDPOINT API LIKE
router.post("/likes", likeController.createLike);
router.post("/unlikes", likeController.unlike);
router.get("/likes/:id", likeController.getAllLike); // id disini id postingan
//? END OF ENDPOINT OF API LIKE

//? ENDPOINT API COMMENT
router.post("/comments", commentController.createComment);
router.get("/comments/:id", commentController.getAllComment); // id disini id postingan
//? END OF ENDPOINT OF API COMMENT

module.exports = router;
