const Device = require("../models/devices.model");
const Orders = require("../models/orders.model");
const User = require("../models/users.model");
class SupplierRepository {
  async findAllSuppliersWithDevices() {
    try {
      const suppliers = await User.find({ role: "supplier" })
        .select("name email companyInfo phone")
        .lean();
      // Get devices for each supplier
      const supplierWithDevices = await Promise.all(
        suppliers.map(async (supplier) => {
          const devices = await Device.find({ supplier: supplier._id })
            .select("name manufacturer model price availability")
            .lean();
          return {
            ...supplier,
            devices,
          };
        })
      );
      return supplierWithDevices;
    } catch (error) {
      throw new Error("Repositry Error: " + error.message);
    }
  }
  async findAllDevices(supplier) {
    try {
      const devices = await Device.find({ supplier: supplier.id }).lean();
      return devices;
    } catch (error) {
      throw new Error("Repositry Error: " + error.message);
    }
  }

  async findAllOrders(supplier) {
    try {
      const orders = await Orders.find({ "supplier.user": supplier.id })
        .select("orderNumber buyer.name items.device status notes")
        .lean();
      return orders;
    } catch (error) {
      throw new Error("Repositry Error: " + error.message);
    }
  }
  async getSupplierAllOrdersData(supplier) {
    try {
      const ordersInDetails = await Orders.find().lean();
      return ordersInDetails;
    } catch (error) {
      throw new Error("Repositry Error: " + error.message);
    }
  }
}

module.exports = SupplierRepository;
