import crypto from "crypto";
import razorpayInstance from "../config/razorpay.js";
import Order from "../models/Order.js";

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
export const createRazorpayOrder = async (req, res, next) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            res.status(400);
            throw new Error("Amount is required");
        }

        const options = {
            amount: Math.round(amount * 100), // convert to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpayInstance.orders.create(options);

        res.status(201).json({
            success: true,
            order,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payment/verify-payment
// @access  Private
export const verifyPayment = async (req, res, next) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            items,
            totalAmount,
            shippingAddress
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isSignatureValid = expectedSignature === razorpay_signature;

        if (isSignatureValid) {
            // Save order in MongoDB ONLY after successful verification
            const newOrder = new Order({
                user: req.user._id,
                items,
                totalAmount,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                status: "paid",
                shippingAddress
            });

            await newOrder.save();

            res.status(200).json({
                success: true,
                message: "Payment verified and order saved successfully",
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid signature, payment verification failed",
            });
        }
    } catch (error) {
        next(error);
    }
};
