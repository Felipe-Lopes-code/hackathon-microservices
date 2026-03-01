const axios = require('axios');

// Middleware de Autenticação para o Serviço de Materiais Didáticos
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido',
      });
    }

    const token = authHeader.substring(7);

    // Verificar token com o Serviço de Autenticação
    const response = await axios.post(
      `${process.env.AUTH_SERVICE_URL}/api/auth/verify`,
      { token },
      { timeout: 5000 }
    );

    if (response.data.success) {
      req.user = response.data.data.user;
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Falha na autenticação',
    });
  }
};

module.exports = authMiddleware;
