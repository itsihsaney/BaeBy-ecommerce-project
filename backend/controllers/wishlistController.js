import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user._id, products: [] });
            wishlist = await wishlist.populate("products");
        }

        res.status(200).json(wishlist);
    } catch (error) {
        next(error);
    }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
export const addToWishlist = async (req, res, next) => {
    try {
        const { productId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID format." });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
        } else {
            if (wishlist.products.includes(productId)) {
                return res.status(400).json({ message: "Product already in wishlist." });
            }
            wishlist.products.push(productId);
            await wishlist.save();
        }

        const populatedWishlist = await wishlist.populate("products");
        res.status(200).json(populatedWishlist);
    } catch (error) {
        next(error);
    }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
export const removeFromWishlist = async (req, res, next) => {
    try {
        const productId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID format." });
        }

        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (wishlist) {
            wishlist.products = wishlist.products.filter(
                (p) => p.toString() !== productId
            );
            await wishlist.save();
            const populatedWishlist = await wishlist.populate("products");
            res.status(200).json(populatedWishlist);
        } else {
            return res.status(404).json({ message: "Wishlist not found." });
        }
    } catch (error) {
        next(error);
    }
};
