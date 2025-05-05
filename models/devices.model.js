const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
  name: { type: String, required: true },
  supplier: { type: Schema.Types.ObjectId, ref: "User", required: true },
  manufacturer: { type: String, required: true },
  model: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ["diagnostic", "therapeutic", "monitoring"],
    required: true,
  },
  price: {
    amount: Number,
    currency: {
      type: String,
      default: "USD",
    },
    discountPercentage: Number,
  },
  availability: {
    inStock: Boolean,
    quantity: Number,
    leadTimeInDays: Number,
  },
  regulatory: {
    fdaApproved: Boolean,
    ceMarked: Boolean,
    approvalDocuments: [
      {
        type: String,
        documentUrl: String,
        issueDate: Date,
        expiryDate: Date,
      },
    ],
  },
  specifications: {
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        default: "cm",
      },
    },
    weight: {
      value: Number,
      unit: {
        type: String,
        default: "kg",
      },
    },
    powerRequirements: String,
    connectivity: [String], // e.g., ['Bluetooth', 'WiFi', 'USB']
    operatingSystem: String,
    compatibleWith: [String],
  },
  images: [
    {
      url: String,
      isPrimary: Boolean,
      caption: String,
    },
  ],
  videos: [
    {
      url: String,
      caption: String,
    },
  ],
  documentation: [
    {
      type: {
        type: String,
        enum: [
          "user manual",
          "technical specifications",
          "brochure",
          "clinical studies",
        ],
      },
      url: String,
      title: String,
    },
  ],
  warranty: {
    durationInMonths: Number,
    description: String,
    extendedWarrantyAvailable: Boolean,
  },
  reviews: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User" },
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      date: {
        type: Date,
        default: Date.now,
      },
      verified: Boolean,
    },
  ],
  visibility: {
    type: String,
    enum: ["public", "private", "draft"],
    default: "draft",
  },
  status: {
    type: String,
    enum: ["active", "inactive", "maintenance", "retired"],
    default: "active",
  },
  lastCalibrationDate: Date,
  nextCalibrationDate: Date,
  location: String,
  department: String,
  metadata: Object,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

deviceSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Device", deviceSchema);
