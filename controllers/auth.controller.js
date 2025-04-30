const AuthServices = require("../services/auth.service");
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public

class AuthController {
  constructor() {
    this.userService = new AuthServices();
  }
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;
      const user = await this.userService.register({
        name,
        email,
        password,
        role,
      });
      this.sendTokenResponse(user, 201, res);
    } catch (error) {
      res.status(500).json({ message: ` ${error.message} ` });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await this.userService.login({ email, password });
      this.sendTokenResponse(user, 200, res);
    } catch (error) {
      res.status(500).json({ message: ` ${error.message} ` });
    }
  }
  async getAllUsers(req, res) {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: `${error.message} ` });
    }
  }
  async getMe(req, res) {
    try {
      const user = await this.userService.getMe(req.user.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: `${error.message} ` });
    }
  }

  async logout(req, res) {
    try {
      await this.userService.logout(req.user.id);
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      res.status(500).json({ message: `${error.message}` });
    }
  }
  async sendTokenResponse(user, statusCode, res) {
    const token = user.getSignedJwtToken();
    res.status(statusCode).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastLogout: user.lastLogout,
      },
    });
  }
}

module.exports = AuthController;
