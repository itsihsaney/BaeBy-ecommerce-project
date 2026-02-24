import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res, next) => {
    try {
        const {
            orderItems, // Expecting items from frontend
            shippingAddress,
            paymentMethod,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error("No order items");
        } else {
            let totalAmount = 0;
            const items = [];

            for (const item of orderItems) {
                const product = await Product.findById(item.product);
                if (!product) {
                    res.status(404);
                    throw new Error(`Product not found: ${item.name}`);
                }
                totalAmount += product.price * item.quantity;
                items.push({
                    name: product.title,
                    quantity: item.quantity,
                    image: product.image,
                    price: product.price,
                    product: product._id
                });
            }

            // Simple logic: add shipping if under $100
            const shippingPrice = totalAmount > 100 ? 0 : 10;
            totalAmount += shippingPrice;

            const order = new Order({
                user: req.user._id,
                items,
                shippingAddress,
                totalAmount,
                status: paymentMethod === "COD" ? "Pending COD" : "paid"
            });

            const createdOrder = await order.save();

            // Clear Cart after successful order
            await Cart.deleteMany({ user: req.user._id });

            res.status(201).json(createdOrder);
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            "user",
            "name email"
        );

        if (order) {
            // Ensure user can only see their own order
            if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                res.status(401);
                throw new Error("Not authorized to view this order");
            }
            res.json(order);
        } else {
            res.status(404);
            throw new Error("Order not found");
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};
