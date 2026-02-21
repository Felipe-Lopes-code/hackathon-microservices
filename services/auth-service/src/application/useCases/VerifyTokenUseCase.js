const jwt = require('jsonwebtoken');

// Use Case - Verify Token
class VerifyTokenUseCase {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async execute(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await this.authRepository.findUserById(decoded.id);

      if (!user) {
        throw new Error('User not found');
      }

      return user.toJSON();
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

module.exports = VerifyTokenUseCase;
