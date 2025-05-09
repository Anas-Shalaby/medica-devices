const User = require("../models/users.model");

class UserRepository {
  async findOne(email) {
    try {
      const user = await User.findOne({ email }).lean();
      return user;
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }
  async create(user) {
    try {
      const newUser = await User.create(user);
      return newUser;
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }
  async findAll() {
    try {
      const users = await User.find().lean();
      return users;
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }
  async update(id, user) {
    try {
      const updatedUser = await User.findByIdAndUpdate(id, user, {
        new: true,
      });
      return updatedUser;
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }
  async findById(id) {
    try {
      const user = await User.findById(id);
      return user;
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const user = await User.findByIdAndDelete(id);
      return user;
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }
  async findOneWithPassword(email) {
    try {
      const user = await User.findOne({ email }).select("+password");
      return user;
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }
}

module.exports = UserRepository;
