const jwt = require('jsonwebtoken');

/**
 * Token Generator Utility
 * Centraliza a geração de tokens JWT para evitar duplicação de código
 */
class TokenGenerator {
  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    
    this.secret = process.env.JWT_SECRET;
    this.accessTokenExpiry = process.env.JWT_EXPIRES_IN || '1h';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  /**
   * Generates an access token with user data
   * @param {Object} user - User object
   * @returns {String} JWT access token
   */
  generateAccessToken(user) {
    if (!user || !user.id) {
      throw new Error('Invalid user data for token generation');
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
   * Generates a refresh token
   * @param {Object} user - User object
   * @returns {String} JWT refresh token
   */
  generateRefreshToken(user) {
    if (!user || !user.id) {
      throw new Error('Invalid user data for token generation');
    }

    return jwt.sign(
      { id: user.id },
      this.secret,
      { expiresIn: this.refreshTokenExpiry }
    );
  }

  /**
   * Verifies a token and returns the payload
   * @param {String} token - JWT token
   * @returns {Object} Decoded token payload
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Decodes a token without verification
   * @param {String} token - JWT token
   * @returns {Object|null} Decoded token or null
   */
  decodeToken(token) {
    return jwt.decode(token);
  }
}

module.exports = new TokenGenerator();
