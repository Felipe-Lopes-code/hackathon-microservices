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

// Middlewares de Segurança
app.use(helmet());
app.use(cors());
app.use(express.json());

// Limitação de Taxa de Requisições
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Muitas requisições deste IP, tente novamente mais tarde.',
});
app.use('/api/auth', limiter);

// Injeção de Dependências
const authRepository = new PostgresAuthRepository();
const registerUseCase = new RegisterUserUseCase(authRepository);
const loginUseCase = new LoginUserUseCase(authRepository);
const verifyTokenUseCase = new VerifyTokenUseCase(authRepository);
const authController = new AuthController(registerUseCase, loginUseCase, verifyTokenUseCase);

// Rotas
app.use('/api/auth', createAuthRoutes(authController));

// Tratamento de Erros Global
app.use((err, req, res, _next) => {
  logger.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
  });
});

// Tratamento de Rota Não Encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
  });
});

app.listen(PORT, () => {
  logger.info(`Auth Service running on port ${PORT}`);
});

module.exports = app;
