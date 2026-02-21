const axios = require('axios');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const token = authHeader.substring(7);

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
        message: 'Invalid token',
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

module.exports = authMiddleware;
