const express = require('express');
const { validate, registerSchema, loginSchema } = require('../validators/authValidator');
const { authMiddleware } = require('../middlewares/authMiddleware');

function createAuthRoutes(authController) {
  const router = express.Router();

  router.post('/register', validate(registerSchema), (req, res) =>
    authController.register(req, res)
  );

  router.post('/login', validate(loginSchema), (req, res) => authController.login(req, res));

  router.post('/verify', (req, res) => authController.verifyToken(req, res));

  router.get('/profile', authMiddleware, (req, res) => authController.getProfile(req, res));

  // Health check
  router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'auth-service' });
  });

  return router;
}

module.exports = createAuthRoutes;
