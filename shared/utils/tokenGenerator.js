const jwt = require('jsonwebtoken');

/**
 * Utilitário de Geração de Tokens
 * Centraliza a geração de tokens JWT para evitar duplicação de código
 */
class TokenGenerator {
  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET não está definido');
    }
    
    this.secret = process.env.JWT_SECRET;
    this.accessTokenExpiry = process.env.JWT_EXPIRES_IN || '1h';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  /**
   * Gera um token de acesso com dados do usuário
   * @param {Object} user - Objeto do usuário
   * @returns {String} Token JWT de acesso
   */
  generateAccessToken(user) {
    if (!user || !user.id) {
      throw new Error('Dados de usuário inválidos para geração de token');
    }

    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      this.secret,
      { expiresIn: this.accessTokenExpiry }
    );
  }

  /**
   * Gera um token de atualização
   * @param {Object} user - Objeto do usuário
   * @returns {String} Token JWT de atualização
   */
  generateRefreshToken(user) {
    if (!user || !user.id) {
      throw new Error('Dados de usuário inválidos para geração de token');
    }

    return jwt.sign(
      { id: user.id },
      this.secret,
      { expiresIn: this.refreshTokenExpiry }
    );
  }

  /**
   * Verifica um token e retorna o payload
   * @param {String} token - Token JWT
   * @returns {Object} Payload do token decodificado
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }

  /**
   * Decodifica um token sem verificação
   * @param {String} token - Token JWT
   * @returns {Object|null} Token decodificado ou null
   */
  decodeToken(token) {
    return jwt.decode(token);
  }
}

module.exports = new TokenGenerator();
