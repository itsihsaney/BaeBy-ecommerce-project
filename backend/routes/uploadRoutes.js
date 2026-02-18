import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinary.js";
import { uploadImage } from "../controllers/uploadController.js";
import protect from "../middlewares/authMiddleware.js";
// import adminOnly from "../middlewares/adminMiddleware.js"; // Optional: restricted to admin

const router = express.Router();
const upload = multer({ storage });

// POST /api/upload
// Note: 'image' is the field name in the form-data
router.post("/", protect, upload.single("image"), uploadImage);

export default router;
