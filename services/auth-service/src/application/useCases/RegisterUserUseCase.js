const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Caso de Uso - Registrar Usuário na plataforma EduShare
class RegisterUserUseCase {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async execute({ email, password, name }) {
    // Verificar se o usuário já existe
    const existingUser = await this.authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error('Usuário já cadastrado');
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await this.authRepository.createUser({
      email,
      password: hashedPassword,
      name,
    });

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

module.exports = RegisterUserUseCase;
