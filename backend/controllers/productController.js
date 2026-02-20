import Product from "../models/Product.js";

export const getProducts = async (req, res, next) => {
    try {
        const { category, minPrice, maxPrice, search, page = 1, limit = 10 } = req.query;

        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        if (category) {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const pageNum = Math.max(1, Number(page)) || 1;
        const limitNum = Math.max(1, Number(limit)) || 10;
        const skip = (pageNum - 1) * limitNum;

        const [totalProducts, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query).skip(skip).limit(limitNum).sort({ createdAt: -1 })
        ]);

        const totalPages = Math.ceil(totalProducts / limitNum);

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            currentPage: pageNum,
            totalPages,
            totalProducts,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

export const getGenzPicks = async (req, res, next) => {
    try {
        const products = await Product.find({ category: "genz" });

        res.status(200).json({
            success: true,
            message: "GenZ picks fetched successfully",
            data: products
        });
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req, res, next) => {
    try {
        const newProduct = new Product(req.body);
        const saved = await newProduct.save();

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: saved
        });
    } catch (error) {
        next(error);
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

        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: product
        });
    } catch (error) {
        next(error);
    }
};
