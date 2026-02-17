import Cart from "../models/Cart.js";

export const getCart = async (req, res) => {
    try {
        const cartItems = await Cart.find({ user: req.user._id }).populate("product");
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart" });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;

        // Check if product already exists for this user
        const existingItem = await Cart.findOne({
            user: req.user._id,
            product: productId
        });

        if (existingItem) {
            return res.status(200).json({ message: "Product already in cart" });
        }

        // If not exists, create new cart item with quantity = 1
        const newCartItem = await Cart.create({
            user: req.user._id,
            product: productId,
            quantity: 1
        });

        const populatedItem = await newCartItem.populate("product");
        res.status(201).json(populatedItem);
    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({ message: "Error adding to cart" });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        await Cart.findOneAndDelete({
            user: req.user._id,
            product: productId
        });

        const updatedCart = await Cart.find({ user: req.user._id }).populate("product");
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: "Error removing from cart" });
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const updatedItem = await Cart.findOneAndUpdate(
            { user: req.user._id, product: productId },
            { quantity },
            { new: true }
        ).populate("product");

        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: "Error updating quantity" });
    }
};
