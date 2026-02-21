require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const PostgresAuthRepository = require('./infrastructure/database/PostgresAuthRepository');
const RegisterUserUseCase = require('./application/useCases/RegisterUserUseCase');
const LoginUserUseCase = require('./application/useCases/LoginUserUseCase');
const VerifyTokenUseCase = require('./application/useCases/VerifyTokenUseCase');
const AuthController = require('./infrastructure/http/controllers/AuthController');
const createAuthRoutes = require('./infrastructure/http/routes/authRoutes');
const logger = require('./infrastructure/logger/logger');

const app = express();
const PORT = process.env.PORT || 3001;

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/auth', limiter);

// Dependency Injection
const authRepository = new PostgresAuthRepository();
const registerUseCase = new RegisterUserUseCase(authRepository);
const loginUseCase = new LoginUserUseCase(authRepository);
const verifyTokenUseCase = new VerifyTokenUseCase(authRepository);
const authController = new AuthController(registerUseCase, loginUseCase, verifyTokenUseCase);

// Routes
app.use('/api/auth', createAuthRoutes(authController));

// Global Error Handler
app.use((err, req, res, _next) => {
  logger.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.listen(PORT, () => {
  logger.info(`Auth Service running on port ${PORT}`);
});

module.exports = app;
