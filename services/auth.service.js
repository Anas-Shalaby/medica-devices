const UserRepository = require("../repositories/user.repository");
const User = require("../models/users.model");
class AuthServices {
  constructor() {
    this.userRepository = new UserRepository();
  }
  async register(user) {
    const existingUser = await this.userRepository.findOne(user.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    return await this.userRepository.create(user);
  }

  async login({ email, password }) {
    // Validate email & password
    if (!email || !password) {
      throw new Error("Please provide an email and password");
    }
    // Check for user
    const user = await this.userRepository.findOneWithPassword(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    return user;
  }
  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users;
  }
  async updateUser(id, user) {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }
    const updatedUser = await this.userRepository.update(id, user);
    return updatedUser;
  }
  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
  async deleteUser(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    await this.userRepository.delete(id);
    return user;
  }

  async getMe(id) {
    const user = await this.userRepository.findById(id);
    return user;
  }
  async logout(id) {
    try {
      const user = await User.findByIdAndUpdate(
        id,
        { lastLogout: Date.now() },
        { new: true }
      );
      return user;
    } catch (error) {
      throw new Error(`Repository error: ${error.message}`);
    }
  }

  sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  };
}

module.exports = AuthServices;
