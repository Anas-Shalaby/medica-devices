const Device = require("../models/devices.model");
const SupplierRepository = require("../repositories/supplier.repository");
class SupplierService {
  constructor() {
    this.supplierRepository = new SupplierRepository();
  }
  async getSuppliersDevices(supplier) {
    return await this.supplierRepository.findAllDevices(supplier);
  }

  async getSuppliersOrders(supplier) {
    return await this.supplierRepository.findAllOrders(supplier);
  }
  async getAllSuppliersWithDevices() {
    return await this.supplierRepository.findAllSuppliersWithDevices();
  }

  async getSupplierAllOrdersData(supplier) {
    return await this.supplierRepository.getSupplierAllOrdersData(supplier);
  }
}

module.exports = SupplierService;
