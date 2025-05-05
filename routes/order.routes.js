const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/order.controller");
const { protect, authorize } = require("../middleware/auth.middleware");
const { check, validationResult } = require("express-validator");

const orderController = new OrderController();

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Order validation rules
const orderValidationRules = [
  check("items")
    .isArray({ min: 1 })
    .withMessage("At least one item is required"),
  check("items.*.device").notEmpty().withMessage("Device ID is required"),
  check("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  check("shippingAddress.recipient")
    .notEmpty()
    .withMessage("Recipient is required"),
  check("shippingAddress.street").notEmpty().withMessage("Street is required"),
  check("shippingAddress.city").notEmpty().withMessage("City is required"),
  check("shippingAddress.country")
    .notEmpty()
    .withMessage("Country is required"),
  check("paymentInfo.method")
    .isIn(["credit_card", "bank_transfer", "purchase_order", "other"])
    .withMessage("Valid payment method is required"),
  validate,
];

// Status update validation
const statusValidationRules = [
  check("status")
    .isIn([
      "draft",
      "placed",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    ])
    .withMessage("Valid status is required"),
  validate,
];

// Note validation
const noteValidationRules = [
  check("content").notEmpty().withMessage("Note content is required"),
  validate,
];

// Document validation
const documentValidationRules = [
  check("type")
    .isIn(["invoice", "receipt", "purchase_order", "shipping_label", "other"])
    .withMessage("Valid document type is required"),
  check("url").notEmpty().withMessage("Document URL is required"),
  check("name").notEmpty().withMessage("Document name is required"),
  validate,
];

// Apply protection to all order routes
router.use(protect);

// Routes that any authenticated user can access
router.get("/my-orders", orderController.getUserOrders.bind(orderController));

// Routes for users (hospitals/doctors)
router.post(
  "/",
  authorize("user", "admin"),
  orderValidationRules,
  orderController.createOrder.bind(orderController)
);

// Routes for specific order - accessible by related parties
router.get("/:id", orderController.getOrderById.bind(orderController));
router.post(
  "/:id/notes",
  noteValidationRules,
  orderController.addOrderNote.bind(orderController)
);

// Routes primarily for suppliers
router.put(
  "/:id/status",
  authorize("supplier", "admin"),
  statusValidationRules,
  orderController.updateOrderStatus.bind(orderController)
);
router.post(
  "/:id/documents",
  authorize("supplier", "admin"),
  documentValidationRules,
  orderController.addOrderDocument.bind(orderController)
);

// Admin-only routes
router.get(
  "/",
  authorize("admin"),
  orderController.getAllOrders.bind(orderController)
);

// Statistics routes
router.get(
  "/stats/overview",
  authorize("supplier", "admin"),
  orderController.getOrderStatistics.bind(orderController)
);

module.exports = router;
