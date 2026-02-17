import express from "express";
import { getProducts, getGenzPicks, createProduct, getProductById } from "../controllers/productController.js";
import validateRequest from "../middlewares/validationMiddleware.js";
import { productSchema } from "../validators/schemas.js";
import protect from "../middlewares/authMiddleware.js";
import adminOnly from "../middlewares/adminMiddleware.js";

const router = express.Router();

// GET all products (with filtering, search, pagination)
router.get("/", getProducts);

// GET genz picks
router.get("/genz", getGenzPicks);

// GET single product
router.get("/:id", getProductById);

// POST product (Admin only)
router.post("/", protect, adminOnly, validateRequest(productSchema), createProduct);

export default router;
