import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

export const getProducts = async (req, res, next) => {
    try {
        const { category, minPrice, maxPrice, keyword, page = 1, limit = 10, sort } = req.query;

        // 1. Search Implementation using Keyword and Title field
        const searchKeyword = keyword
            ? {
                title: {
                    $regex: keyword,
                    $options: "i",
                },
            }
            : {};

        const query = { ...searchKeyword };

        // 2. Advanced Filtering
        if (category) {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 8; // Default to 8 as per requirements
        const skip = (pageNum - 1) * limitNum;

        // Sorting Logic - Added _id as tie-breaker for stable pagination
        let sortQuery = { createdAt: -1, _id: 1 };
        if (sort === 'lowToHigh') sortQuery = { price: 1, _id: 1 };
        if (sort === 'highToLow') sortQuery = { price: -1, _id: 1 };
        if (sort === 'name-az') sortQuery = { title: 1, _id: 1 };

        const [totalProducts, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .sort(sortQuery)
                .skip(skip)
                .limit(limitNum)
        ]);

        const totalPages = Math.ceil(totalProducts / limitNum);

        // Standard Response Format as requested
        res.status(200).json({
            success: true,
            products,
            page: pageNum,
            pages: totalPages,
            totalProducts
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
        if (!req.file) {
            res.status(400);
            throw new Error("Please upload an image");
        }

        // Upload image to Cloudinary from memory
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "baeby_products" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(req.file.buffer);
        });

        const productData = {
            ...req.body,
            image: uploadResult.secure_url
        };

        const newProduct = new Product(productData);
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
