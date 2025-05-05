const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  orderNumber: {
    type: String,
    unique: true,
  },
  buyer: {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    email: String,
    phone: String,
  },
  supplier: {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyName: String,
    contactPerson: String,
    email: String,
    phone: String,
  },
  items: [
    {
      device: { type: Schema.Types.ObjectId, ref: "Device", required: true },
      name: String,
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      unitPrice: {
        amount: Number,
        currency: String,
      },
      totalPrice: {
        amount: Number,
        currency: String,
      },
      discountApplied: Number,
    },
  ],
  billing: {
    subtotal: Number,
    tax: Number,
    shipping: Number,
    discount: Number,
    total: Number,
    currency: {
      type: String,
      default: "USD",
    },
  },
  shippingAddress: {
    recipient: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    specialInstructions: String,
  },
  billingAddress: {
    recipient: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  paymentInfo: {
    method: {
      type: String,
      enum: ["credit_card", "bank_transfer", "purchase_order", "other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "refunded"],
      default: "pending",
    },
    transactionId: String,
    paymentDate: Date,
    purchaseOrderNumber: String,
  },
  status: {
    type: String,
    enum: [
      "draft",
      "placed",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    ],
    default: "draft",
  },
  statusHistory: [
    {
      status: String,
      date: Date,
      note: String,
      updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
  ],
  shipping: {
    method: String,
    trackingNumber: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    carrier: String,
  },
  notes: [
    {
      content: String,
      date: {
        type: Date,
        default: Date.now,
      },
      author: { type: Schema.Types.ObjectId, ref: "User" },
      isInternal: {
        type: Boolean,
        default: false,
      },
    },
  ],
  documents: [
    {
      type: {
        type: String,
        enum: [
          "invoice",
          "receipt",
          "purchase_order",
          "shipping_label",
          "other",
        ],
      },
      url: String,
      date: Date,
      name: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Generate order number
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    this.orderNumber = `ORD-${year}${month}-${random}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
