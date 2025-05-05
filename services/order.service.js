const OrderRepository = require("../repositories/order.repository");
const UserRepository = require("../repositories/user.repository");
const DeviceRepository = require("../repositories/device.repository");

class OrderService {
  constructor() {
    this.orderRepository = new OrderRepository();
    this.userRepository = new UserRepository();
    this.deviceRepository = new DeviceRepository();
  }

  async getAllOrders() {
    return await this.orderRepository.findAll();
  }

  async getOrderById(id) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  }

  async getUserOrders(userId, role) {
    return await this.orderRepository.findByUser(userId, role);
  }

  async createOrder(orderData, buyerId) {
    // Get buyer information
    const buyer = await this.userRepository.findById(buyerId);
    if (!buyer) {
      throw new Error("Buyer not found");
    }

    // Validate items and calculate totals
    const items = [];
    let subtotal = 0;

    for (const item of orderData.items) {
      const device = await this.deviceRepository.findById(item.device);
      if (!device) {
        throw new Error(`Device with ID ${item.device} not found`);
      }
      // Check if supplier is valid
      if (!orderData?.supplier?.user) {
        orderData.supplier = {
          user: device.supplier,
        };
      } else if (
        orderData.supplier.user.toString() !== device.supplier.toString()
      ) {
        throw new Error("All items must be from the same supplier");
      }

      // Get price information
      const unitPrice = device.price?.amount || 0;
      const currency = device.price?.currency || "USD";
      const discountPercentage = device.price?.discountPercentage || 0;
      const discountAmount = (unitPrice * discountPercentage) / 100;
      const discountedPrice = unitPrice - discountAmount;
      const totalPrice = discountedPrice * item.quantity;

      // Add to items array
      items.push({
        device: device._id,
        name: device.name,
        quantity: item.quantity,
        unitPrice: {
          amount: unitPrice,
          currency,
        },
        totalPrice: {
          amount: totalPrice,
          currency,
        },
        discountApplied: discountAmount,
      });

      subtotal += totalPrice;
    }

    // Get supplier information
    const supplierId = orderData.supplier.user;
    const supplier = await this.userRepository.findById(supplierId);
    if (!supplier) {
      throw new Error("Supplier not found");
    }

    // Calculate billing
    const tax = orderData.billing?.tax || subtotal * 0.1; // Default 10% tax
    const shipping = orderData.billing?.shipping || 0;
    const discount = orderData.billing?.discount || 0;
    const total = subtotal + tax + shipping - discount;
    // Create order object
    const newOrder = {
      buyer: {
        user: buyer._id,
        name: buyer.name,
        email: buyer.email,
        phone: buyer.phone,
      },
      supplier: {
        user: supplier._id,
        companyName: supplier.companyInfo?.name || supplier.name,
        contactPerson: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
      },
      items,
      billing: {
        subtotal,
        tax,
        shipping,
        discount,
        total,
        currency: items[0].unitPrice.currency, // Use currency from first item
      },
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress || orderData.shippingAddress,
      paymentInfo: orderData.paymentInfo,
      status: "draft",
      statusHistory: [
        {
          status: "draft",
          date: new Date(),
          note: "Order created",
          updatedBy: buyer._id,
        },
      ],
    };

    // Create the order
    const order = await this.orderRepository.create(newOrder);
    return order;
  }

  async updateOrderStatus(id, status, userId, note) {
    // Validate status transition
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }

    // Check valid status transitions
    const validTransitions = {
      draft: ["placed", "cancelled"],
      placed: ["confirmed", "cancelled"],
      confirmed: ["processing", "cancelled"],
      processing: ["shipped", "cancelled"],
      shipped: ["delivered", "returned"],
      delivered: ["returned"],
      cancelled: [],
      returned: [],
    };

    if (!validTransitions[order.status].includes(status)) {
      throw new Error(
        `Invalid status transition from ${order.status} to ${status}`
      );
    }

    // Update the status
    return await this.orderRepository.updateStatus(id, status, userId, note);
  }

  async addOrderNote(id, content, authorId, isInternal = false) {
    const noteData = {
      content,
      author: authorId,
      date: new Date(),
      isInternal,
    };

    return await this.orderRepository.addNote(id, noteData);
  }

  async addOrderDocument(id, documentData) {
    return await this.orderRepository.addDocument(id, {
      ...documentData,
      date: new Date(),
    });
  }

  async getOrderStatistics(supplierId = null) {
    return await this.orderRepository.getOrderStats(supplierId);
  }
}

module.exports = OrderService;
