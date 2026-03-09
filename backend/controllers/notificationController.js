import Notification from "../models/Notification.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Get all notifications (Admin only)
// @route   GET /api/admin/notifications
// @access  Private/Admin
export const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({})
        .sort({ createdAt: -1 })
        .limit(50); // Limit to top 50 recent ones

    res.json({
        status: "success",
        data: notifications,
    });
});

// @desc    Get total unread notifications (Admin only)
// @route   GET /api/admin/notifications/unread-count
// @access  Private/Admin
export const getUnreadCount = asyncHandler(async (req, res) => {
    const count = await Notification.countDocuments({ isRead: false });

    res.json({
        status: "success",
        count: count,
    });
});

// @desc    Mark notification as read
// @route   PATCH /api/admin/notifications/:id/read
// @access  Private/Admin
export const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
        notification.isRead = true;
        await notification.save();

        res.json({
            status: "success",
            message: "Notification marked as read",
        });
    } else {
        res.status(404);
        throw new Error("Notification not found");
    }
});

// @desc    Mark all notifications as read
// @route   PATCH /api/admin/notifications/read-all
// @access  Private/Admin
export const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany({ isRead: false }, { isRead: true });

    res.json({
        status: "success",
        message: "All notifications marked as read",
    });
});
