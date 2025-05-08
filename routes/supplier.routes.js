const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth.middleware");
const SupplierController = require("../controllers/supplier.controller");

const supplierController = new SupplierController();

router.use(protect);

// get all suppliers products
router.get(
  "/products",
  authorize("admin", "supplier"),
  supplierController.getSuppliersDevices.bind(supplierController)
);
// get all suppliers orders
router.get(
  "/orders",
  authorize("admin", "supplier"),
  supplierController.getSupplierOrders.bind(supplierController)
);
// get all suplliers orders in details

router.get(
  "/orders-all",
  authorize("admin", "supplier"),
  supplierController.getSupplierAllOrdersData.bind(supplierController)
);
// get all suppliers with their devices
router.get(
  "/all",
  authorize("admin"),
  supplierController.getAllSuppliersWithDevices.bind(supplierController)
);
module.exports = router;
