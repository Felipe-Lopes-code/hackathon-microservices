// Auth Controller
class AuthController {
  constructor(registerUseCase, loginUseCase, verifyTokenUseCase) {
    this.registerUseCase = registerUseCase;
    this.loginUseCase = loginUseCase;
    this.verifyTokenUseCase = verifyTokenUseCase;
  }

  async register(req, res) {
    try {
      const result = await this.registerUseCase.execute(req.body);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const result = await this.loginUseCase.execute(req.body);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  async verifyToken(req, res) {
    try {
      const { token } = req.body;
      const user = await this.verifyTokenUseCase.execute(token);

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getProfile(req, res) {
    res.status(200).json({
      success: true,
      data: { user: req.user },
    });
  }
}

module.exports = AuthController;
