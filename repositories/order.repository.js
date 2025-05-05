const Order = require("../models/orders.model");

class OrderRepository {
  async findAll(query = {}) {
    try {
      const orders = await Order.find(query)
        .populate("buyer.user", "name email")
        .populate("supplier.user", "name email")
        .populate("items.device", "name model manufacturer")
        .lean();
      return orders;
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const order = await Order.findById(id)
        .populate("buyer.user", "name email")
        .populate("supplier.user", "name email")
        .populate("items.device", "name model manufacturer serialNumber images")
        .populate("statusHistory.updatedBy", "name email role")
        .populate("notes.author", "name email role");
      return order;
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  async findByUser(userId, role) {
    try {
      // Determine the query based on the user's role
      let query = {};
      if (role === "supplier") {
        query = { "supplier.user": userId };
      } else {
        query = { "buyer.user": userId };
      }

      const orders = await Order.find(query)
        .populate("buyer.user", "name email")
        .populate("supplier.user", "name email")
        .populate("items.device", "name model manufacturer")
        .sort({ createdAt: -1 })
        .lean();
      return orders;
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  async create(orderData) {
    try {
      const order = new Order(orderData);
      await order.save();
      return order;
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      const order = await Order.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })
        .populate("buyer.user", "name email")
        .populate("supplier.user", "name email")
        .populate("items.device", "name model manufacturer");
      return order;
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  async updateStatus(id, status, userId, note = "") {
    try {
      // Create status history entry
      const statusUpdate = {
        status,
        date: new Date(),
        note,
        updatedBy: userId,
      };

      const order = await Order.findByIdAndUpdate(
        id,
        {
          status,
          $push: { statusHistory: statusUpdate },
        },
        { new: true, runValidators: true }
      )
        .populate("buyer.user", "name email")
        .populate("supplier.user", "name email")
        .populate("items.device", "name model manufacturer");

      return order;
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  async addNote(id, noteData) {
    try {
      const order = await Order.findByIdAndUpdate(
        id,
        { $push: { notes: noteData } },
        { new: true, runValidators: true }
      )
        .populate("buyer.user", "name email")
        .populate("supplier.user", "name email")
        .populate("items.device", "name model manufacturer");

      return order;
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  async addDocument(id, documentData) {
    try {
      const order = await Order.findByIdAndUpdate(
        id,
        { $push: { documents: documentData } },
        { new: true, runValidators: true }
      );

      return order;
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  async getOrderStats(supplierId = null) {
    try {
      let matchStage = {};
      if (supplierId) {
        matchStage = { "supplier.user": mongoose.Types.ObjectId(supplierId) };
      }

      const stats = await Order.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalValue: { $sum: "$billing.total" },
          },
        },
      ]);

      return stats;
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }
}

module.exports = OrderRepository;
