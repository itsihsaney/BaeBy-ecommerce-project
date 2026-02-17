import express from "express";
import { register, login, refresh, logout, getProfile } from "../controllers/authController.js";
import protect from "../middlewares/authMiddleware.js";
import adminOnly from "../middlewares/adminMiddleware.js";
import validateRequest from "../middlewares/validationMiddleware.js";
import { registerSchema, loginSchema } from "../validators/schemas.js";

const router = express.Router();

// REGISTER
router.post("/register", validateRequest(registerSchema), register);

// LOGIN
router.post("/login", validateRequest(loginSchema), login);

// REFRESH TOKEN
router.post("/refresh", refresh);

// LOGOUT
router.post("/logout", logout);

// Protected Route
router.get("/profile", protect, getProfile);

// admin
router.get("/admin-test", protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome Admin of Baeby" });
});

export default router;
