import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Global Admin Search
// @route   GET /api/admin/search
// @access  Private/Admin
export const globalSearch = asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.json({
            users: [],
            products: [],
            orders: []
        });
    }

    const regex = { $regex: q, $options: "i" };

    // Optimize by running queries in parallel
    const [users, products, orders] = await Promise.all([
        User.find({
            $or: [
                { name: regex },
                { email: regex }
            ]
        }).limit(5).select("name email role"),

        Product.find({
            $or: [
                { title: regex },
                { category: regex }
            ]
        }).limit(5).select("title category price image"),

        Order.find({
            $or: [
                { orderId: regex }
            ]
        }).limit(5).populate("user", "name").sort({ createdAt: -1 })
    ]);

    res.json({
        users,
        products,
        orders
    });
});
