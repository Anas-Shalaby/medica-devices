const express = require("express");
const connectDB = require("./config/db");
const medicalDevicesRoute = require("./routes/device.routes.js");
const authRoutes = require("./routes/auth.routes.js");
const orderRoutes = require("./routes/order.routes.js");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json()); // middleware to parse json data

connectDB();
app.use("/api/medical_devices", medicalDevicesRoute);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

app.listen(port, () => {
  console.log("server is running on port 4000");
});
