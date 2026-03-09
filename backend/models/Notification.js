import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: ["order", "user"],
        },
        message: {
            type: String,
            required: true,
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Add index for performance
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ isRead: 1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
