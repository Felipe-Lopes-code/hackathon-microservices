const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Caso de Uso - Login de Usuário na plataforma EduShare
class LoginUserUseCase {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async execute({ email, password }) {
    // Buscar usuário
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    // Gerar tokens de acesso
    const accessToken = this._generateAccessToken(user);
    const refreshToken = this._generateRefreshToken(user);

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  }

  _generateAccessToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }

  _generateRefreshToken(user) {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
  }
}

module.exports = LoginUserUseCase;
