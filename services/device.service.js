const DeviceRepository = require("../repositories/device.repository");

class DeviceService {
  constructor() {
    this.deviceRepository = new DeviceRepository();
  }

  async getAllDevices() {
    const devices = await this.deviceRepository.findAll();
    return devices;
  }

  async getDeviceById(id) {
    const device = await this.deviceRepository.findById(id);

    return device;
  }

  async createDevice(deviceData) {
    // Invalidate relevant cache
    return this.deviceRepository.create(deviceData);
  }

  async updateDevice(id, deviceData) {
    return this.deviceRepository.update(id, deviceData);
  }

  async deleteDevice(id) {
    return this.deviceRepository.delete(id);
  }
}

module.exports = DeviceService;
