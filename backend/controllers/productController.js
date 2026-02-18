import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, search, page = 1, limit = 10 } = req.query;

        const query = {};

        // 1. Filtering by Category
        if (category) {
            query.category = category;
        }

        // 2. Filtering by Price Range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // 3. Search by Keyword (Regex)
        if (search) {
            query.name = { $regex: search, $options: "i" }; // case-insensitive
        }

        // 4. Pagination
        const skip = (page - 1) * limit;

        const products = await Product.find(query)
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments(query);

        res.json({
            products,
            page: Number(page),
            pages: Math.ceil(total / limit),
            total,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching products" });
    }
};

export const getGenzPicks = async (req, res) => {
    try {
        const products = await Product.find({ category: "genz" });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching genz picks" });
    }
};

export const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const saved = await newProduct.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ message: "Error creating product" });
    }
};

export const getProductById = async (req, res, next) => {
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(404);
            throw new Error("Product not found");
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404);
            throw new Error("Product not found");
        }
        res.json(product);
    } catch (error) {
        next(error);
    }
};
