import express from "express";
import {
    adminLogin,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getStats
} from "../controllers/adminController.js";
import {
    getOrders,
    updateOrderStatus
} from "../controllers/adminOrderController.js";
import {
    globalSearch
} from "../controllers/adminSearchController.js";
import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
} from "../controllers/notificationController.js";

import adminOnly from "../middlewares/adminMiddleware.js";
import protect from "../middlewares/authMiddleware.js";
import validateRequest from "../middlewares/validationMiddleware.js";
import {
    adminLoginSchema,
    createProductSchema,
    updateProductSchema,
    updateUserSchema,
    updateOrderSchema
} from "../validation/adminValidation.js";


const router = express.Router();

// Public route for admin login
router.post("/login", validateRequest(adminLoginSchema), adminLogin);

// Protect all following routes
router.use(protect, adminOnly);

// Users management
router.route("/users")
    .get(getUsers);

router.route("/users/:id")
    .get(getUserById)
    .patch(validateRequest(updateUserSchema), updateUser)
    .delete(deleteUser);


// Products management
router.route("/products")
    .get(getProducts)
    .post(validateRequest(createProductSchema), createProduct);

router.route("/products/:id")
    .get(getProductById)
    .put(validateRequest(updateProductSchema), updateProduct)
    .delete(deleteProduct);

// Orders management
router.route("/orders")
    .get(getOrders);

router.route("/orders/:id")
    .patch(validateRequest(updateOrderSchema), updateOrderStatus);


// Dashboard stats
router.route("/stats")
    .get(getStats);

// Global Search
router.route("/search")
    .get(globalSearch);

// Notifications
router.route("/notifications")
    .get(getNotifications);

router.route("/notifications/unread-count")
    .get(getUnreadCount);

router.route("/notifications/:id/read")
    .patch(markAsRead);

router.route("/notifications/read-all")
    .patch(markAllAsRead);


export default router;
