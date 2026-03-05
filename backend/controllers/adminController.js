import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
        expiresIn: "30d",
    });
};

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await User.findOne({
    email,
    role: "admin"
  });

  if (!admin) {
    res.status(401);
    throw new Error("Admin not found");
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid password");
  }

  res.json({
    status: "success",
    message: "Successfully logged in",
    data: { jwt_token: generateToken(admin._id) }
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password");
    res.json({
        status: "success",
        message: "Users retrieved successfully",
        data: users
    });
});

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if (user) {
        res.json({
            status: "success",
            message: "User retrieved successfully",
            data: user
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Get all products
// @route   GET /api/admin/products
// @access  Private/Admin
export const getProducts = asyncHandler(async (req, res) => {
    const query = {};
    if (req.query.category) {
        query.category = { $regex: new RegExp(`^${req.query.category}$`, "i") };
    }

    const products = await Product.find(query);
    res.json({
        status: "success",
        message: "Products retrieved successfully",
        data: products
    });
});

// @desc    Get product by ID
// @route   GET /api/admin/products/:id
// @access  Private/Admin
export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json({
            status: "success",
            message: "Product retrieved successfully",
            data: product
        });
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

// @desc    Create a product
// @route   POST /api/admin/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
    const { title, description, image, price, category } = req.body;

    const product = new Product({
        title,
        description,
        image,
        price,
        category,
    });

    const createdProduct = await product.save();

    res.status(201).json({
        status: "success",
        message: "Product created successfully",
        data: createdProduct
    });
});

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
    const { title, description, image, price, category } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        if (title !== undefined) product.title = title;
        if (description !== undefined) product.description = description;
        if (image !== undefined) product.image = image;
        if (price !== undefined) product.price = price;
        if (category !== undefined) product.category = category;

        const updatedProduct = await product.save();

        res.json({
            status: "success",
            message: "Product updated successfully",
            data: updatedProduct
        });
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await Product.deleteOne({ _id: product._id });
        res.json({
            status: "success",
            message: "Product deleted successfully",
            data: null
        });
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({})
        .populate("user", "name email")
        .populate("items.product", "title price image category");

    res.json({
        status: "success",
        message: "Orders retrieved successfully",
        data: orders
    });
});

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({});

    const revenueStats = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalAmount" }
            }
        }
    ]);

    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;

    res.json({
        status: "success",
        message: "Stats retrieved successfully",
        data: {
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue
        }
    });
});
