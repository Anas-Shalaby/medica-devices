const Device = require("../models/devices.model");

class DeviceRepository {
  async findAll(options = {}) {
    try {
      // for pagination and filter
      const page = options.page || 1;
      const limit = options.limit || 10;
      const filters = options.filters || {};

      const query = this.buildQuery(filters);

      const queryOptions = {
        skip: (page - 1) * limit,
        limit: parseInt(limit),
        sort: { createdAt: -1 }, // Newest first
      };

      const [devices, total] = await Promise.all([
        Device.find({}).lean(),
        Device.countDocuments({}),
      ]);

      return {
        devices,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await Device.findById(id).lean();
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  async findBySerialNumber(serialNumber) {
    try {
      return await Device.findOne({ serialNumber }).lean();
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  async create(deviceData, userData) {
    try {
      deviceData.supplier = userData._id;
      const device = new Device(deviceData);
      await device.save();
      return device.toObject();
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  async update(id, deviceData) {
    try {
      const updatedDevice = await Device.findByIdAndUpdate(
        id,
        { $set: deviceData },
        { new: true, runValidators: true }
      ).lean();

      if (!updatedDevice) {
        throw new Error("Device not found");
      }

      return updatedDevice;
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const deletedDevice = await Device.findByIdAndDelete(id).lean();
      if (!deletedDevice) {
        throw new Error("Device not found");
      }
      return deletedDevice;
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  async getDeviceStats() {
    try {
      return await Device.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            status: "$_id",
            count: 1,
            _id: 0,
          },
        },
      ]);
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  // Helper method to build query based on filters
  buildQuery(filters) {
    const query = {};

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.department) {
      query.department = filters.department;
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: "i" } },
        { manufacturer: { $regex: filters.search, $options: "i" } },
        { model: { $regex: filters.search, $options: "i" } },
        { serialNumber: { $regex: filters.search, $options: "i" } },
      ];
    }

    return query;
  }
}

module.exports = DeviceRepository;
