const jwt = require('jsonwebtoken');

// Caso de Uso - Verificar Token de Acesso
class VerifyTokenUseCase {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async execute(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await this.authRepository.findUserById(decoded.id);

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return user.toJSON();
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
}

module.exports = VerifyTokenUseCase;
