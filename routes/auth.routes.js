const express = require("express");
const { body, validationResult } = require("express-validator");
const AuthController = require("../controllers/auth.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

const router = express.Router();
const authController = new AuthController();

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Register validation rules
const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please include a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(["user", "supplier", "admin"])
    .withMessage("Role must be either user, supplier, or admin"),
  validate,
];

// Login validation rules
const loginValidation = [
  body("email").isEmail().withMessage("Please include a valid email"),
  body("password").exists().withMessage("Password is required"),
  validate,
];

// Routes with validation
router.post(
  "/register",
  registerValidation,
  authController.register.bind(authController)
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  authController.deleteUser.bind(authController)
);

router.post(
  "/login",
  loginValidation,
  authController.login.bind(authController)
);
router.get(
  "/:id",
  protect,
  authorize("admin"),
  authController.getUserById.bind(authController)
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  authController.updateUser.bind(authController)
);
router.get("/me", protect, authController.getMe.bind(authController));
router.get("/logout", protect, authController.logout.bind(authController));
router.get(
  "/",
  protect,
  authorize("admin"),
  authController.getAllUsers.bind(authController)
);

module.exports = router;
