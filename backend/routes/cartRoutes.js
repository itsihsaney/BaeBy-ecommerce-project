import express from "express";
import { getCart, addToCart, removeFromCart, updateQuantity } from "../controllers/cartController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
    .get(protect, getCart)
    .post(protect, addToCart)
    .put(protect, updateQuantity);

router.route("/:productId")
    .delete(protect, removeFromCart);

export default router;
