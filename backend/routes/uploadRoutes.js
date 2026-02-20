import express from "express";
import multer from "multer";
import path from "path";
import { uploadImage } from "../controllers/uploadController.js";
// import protect from "../middlewares/authMiddleware.js"; // REMOVED FOR DEBUGGING

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/");
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb("Images only!");
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// POST /api/upload
router.post("/", (req, res, next) => {
    console.log(">>> DEBUG: UPLOAD ROUTE REACHED AT THE TOP");
    next();
}, upload.single("image"), uploadImage);

// TEST ROUTE
router.get("/test", (req, res) => {
    res.json({ message: "Upload route /test is working without auth" });
});

export default router;
