const express = require("express");
const connectDB = require("./config/db");
const medicalDevicesRoute = require("./routes/device.routes.js");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// app.use(cors());
app.use(express.json()); // middleware to parse json data

connectDB();

app.use("/api/medical_devices", medicalDevicesRoute);

app.listen(4000, () => {
  console.log("server is running on port 4000");
});
