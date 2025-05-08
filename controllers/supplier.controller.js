const SupplierService = require("../services/supplier.service");
class SupplierController {
  constructor() {
    this.supplierServices = new SupplierService();
  }
  async getSuppliersDevices(req, res) {
    try {
      const products = await this.supplierServices.getSuppliersDevices(
        req.user
      );

      res
        .status(200)
        .json({ status: true, data: products, count: products.length });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  }

  async getSupplierOrders(req, res) {
    try {
      const orders = await this.supplierServices.getSuppliersOrders(req.user);
      if (!orders) {
        return res.status(201).json({ status: true, data: [] });
      }
      res
        .status(200)
        .json({ status: true, count: orders.length, data: orders });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  }

  async getAllSuppliersWithDevices(req, res) {
    try {
      const suppliers =
        await this.supplierServices.getAllSuppliersWithDevices();
      res.status(200).json({
        status: true,
        data: suppliers,
        count: suppliers.length,
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  }

  async getSupplierAllOrdersData(req, res) {
    try {
      const orders = await this.supplierServices.getSupplierAllOrdersData(
        req.user
      );
      res.status(200).json({
        status: true,
        data: orders,
        count: orders.length,
      });
    } catch (error) {}
  }
}

module.exports = SupplierController;
