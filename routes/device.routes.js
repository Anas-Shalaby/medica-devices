const express = require("express");
const router = express.Router();
const DeviceController = require("../controllers/device.controller");
const { check } = require("express-validator");

const deviceController = new DeviceController();

// Validation rules
const deviceValidationRules = [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("manufacturer").not().isEmpty().withMessage("Manufacturer is required"),
  check("model").not().isEmpty().withMessage("Model is required"),
  check("serialNumber")
    .not()
    .isEmpty()
    .withMessage("Serial number is required"),
  check("type")
    .isIn(["diagnostic", "therapeutic", "monitoring"])
    .withMessage("Invalid device type"),
];

// Apply auth middleware to all device routes
// router.use(authMiddleware);

// Device routes
router.get("/", deviceController.getAllDevices.bind(deviceController));
router.get("/:id", deviceController.getDevice.bind(deviceController));
router.post(
  "/",
  deviceValidationRules,
  deviceController.createDevice.bind(deviceController)
);
router.put(
  "/:id",
  deviceValidationRules,
  deviceController.updateDevice.bind(deviceController)
);
router.delete("/:id", deviceController.deleteDevice.bind(deviceController));

module.exports = router;
