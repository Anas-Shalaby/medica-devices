const express = require("express");
const connectDB = require("./config/db");
const medicalDevicesRoute = require("./routes/device.routes.js");
const authRoutes = require("./routes/auth.routes.js");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json()); // middleware to parse json data

connectDB();
app.use("/api/medical_devices", medicalDevicesRoute);
app.use("/api/auth", authRoutes);

app.listen(4000, () => {
  console.log("server is running on port 4000");
});
