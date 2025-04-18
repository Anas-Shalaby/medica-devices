const DeviceService = require("../services/device.service");
const { validationResult } = require("express-validator");

class DeviceController {
  constructor() {
    this.deviceService = new DeviceService();
  }

  async getAllDevices(req, res) {
    try {
      const devices = await this.deviceService.getAllDevices();
      res.json(devices);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getDevice(req, res) {
    try {
      const device = await this.deviceService.getDeviceById(req.params.id);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }
      res.json(device);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createDevice(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newDevice = await this.deviceService.createDevice(req.body);
      res.status(201).json(newDevice);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateDevice(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const updatedDevice = await this.deviceService.updateDevice(
        req.params.id,
        req.body
      );
      if (!updatedDevice) {
        return res.status(404).json({ message: "Device not found" });
      }
      res.json(updatedDevice);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteDevice(req, res) {
    try {
      const deletedDevice = await this.deviceService.deleteDevice(
        req.params.id
      );
      if (!deletedDevice) {
        return res.status(404).json({ message: "Device not found" });
      }
      res.json({ message: "Device deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = DeviceController;
