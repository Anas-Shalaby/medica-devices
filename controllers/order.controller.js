const OrderService = require("../services/order.service");
const { validationResult } = require("express-validator");

class OrderController {
  constructor() {
    this.orderService = new OrderService();
  }

  async getAllOrders(req, res) {
    try {
      // Only admin can see all orders
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Not authorized to access all orders",
        });
      }

      const orders = await this.orderService.getAllOrders();
      res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await this.orderService.getOrderById(req.params.id);

      // Check if user is authorized to view this order
      if (
        req.user.role !== "admin" &&
        order.buyer.user._id.toString() !== req.user.id &&
        order.supplier.user._id.toString() !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to view this order",
        });
      }

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      res.status(error.message.includes("not found") ? 404 : 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getUserOrders(req, res) {
    try {
      const orders = await this.orderService.getUserOrders(
        req.user.id,
        req.user.role
      );
      res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async createOrder(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    try {
      const order = await this.orderService.createOrder(req.body, req.user.id);
      res.status(201).json({
        success: true,
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateOrderStatus(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    try {
      const { status, note } = req.body;
      const order = await this.orderService.updateOrderStatus(
        req.params.id,
        status,
        req.user.id,
        note
      );

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      res.status(error.message.includes("not found") ? 404 : 400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async addOrderNote(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    try {
      const { content, isInternal } = req.body;
      const order = await this.orderService.addOrderNote(
        req.params.id,
        content,
        req.user.id,
        isInternal
      );

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      res.status(error.message.includes("not found") ? 404 : 400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async addOrderDocument(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    try {
      const documentData = req.body;
      const order = await this.orderService.addOrderDocument(
        req.params.id,
        documentData
      );

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      res.status(error.message.includes("not found") ? 404 : 400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getOrderStatistics(req, res) {
    try {
      let supplierId = null;

      // If user is a supplier, only show their stats
      if (req.user.role === "supplier") {
        supplierId = req.user.id;
      }
      // If admin is requesting specific supplier stats
      else if (req.user.role === "admin" && req.query.supplierId) {
        supplierId = req.query.supplierId;
      }

      const stats = await this.orderService.getOrderStatistics(supplierId);
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = OrderController;
