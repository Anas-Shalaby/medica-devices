const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  model: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ["diagnostic", "therapeutic", "monitoring"],
    required: true,
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
