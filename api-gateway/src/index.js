require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { createServiceProxy } = require('./proxy/proxyConfig');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'EduShare Platform API',
    version: '1.0.0',
    description: 'API para plataforma de compartilhamento de materiais didáticos entre professores do ensino público brasileiro',
    contact: {
      name: 'Equipe EduShare',
      email: 'contato@edushare.com.br',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: `http://localhost:${PORT}/api`,
      description: 'Servidor de Desenvolvimento',
    },
    {
      url: 'https://api.edushare.com.br/api',
      description: 'Servidor de Produção',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Autenticação via token JWT',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Mensagem de erro',
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          name: {
            type: 'string',
            example: 'Maria Silva',
          },
          email: {
            type: 'string',
            example: 'maria.silva@educacao.sp.gov.br',
          },
          role: {
            type: 'string',
            enum: ['teacher', 'admin'],
            example: 'teacher',
          },
        },
      },
      Material: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          title: {
            type: 'string',
            example: 'Plano de Aula - Matemática Básica',
          },
          description: {
            type: 'string',
            example: 'Material completo para ensino de frações',
          },
          category: {
            type: 'string',
            example: 'Matemática',
          },
          author_id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00Z',
          },
        },
      },
      Share: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          material_id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          teacher_id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          status: {
            type: 'string',
            enum: ['pending', 'completed', 'cancelled'],
            example: 'completed',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00Z',
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'Auth',
      description: 'Endpoints de autenticação de professores e alunos',
    },
    {
      name: 'Materials',
      description: 'Endpoints para gerenciamento de materiais didáticos',
    },
    {
      name: 'Shares',
      description: 'Endpoints para compartilhamento de materiais entre professores',
    },
  ],
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [
    path.join(__dirname, 'swagger', '*.js').replace(/\\/g, '/'),
    path.join(__dirname, 'index.js').replace(/\\/g, '/')
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Debug: Log de informações do Swagger
console.log('Swagger paths count:', Object.keys(swaggerSpec.paths || {}).length);
console.log('Swagger tags count:', (swaggerSpec.tags || []).length);

// Middlewares de Segurança
app.use(helmet());

// Configuração do CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// Log de Requisições
app.use(morgan('combined'));

// Parser de Corpo da Requisição
app.use(express.json());

// Limitação de Taxa de Requisições
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Muitas requisições deste IP, tente novamente mais tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Verificação de Saúde
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
  });
});

// Interface do Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'EduShare API Documentation',
}));

// Documentação da API
/**
 * @swagger
 * /:
 *   get:
 *     summary: Informações sobre a API
 *     description: Retorna informações básicas sobre o API Gateway e serviços disponíveis
 *     tags: [Info]
 *     responses:
 *       200:
 *         description: Informações do API Gateway
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: API Gateway
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 services:
 *                   type: object
 *                   properties:
 *                     auth:
 *                       type: string
 *                       example: /api/auth
 *                     materials:
 *                       type: string
 *                       example: /api/materials
 *                     shares:
 *                       type: string
 *                       example: /api/shares
 */
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Gateway',
    version: '1.0.0',
    services: {
      auth: '/api/auth',
      materials: '/api/materials',
      shares: '/api/shares',
    },
    documentation: '/api/docs',
  });
});

// Proxies dos Serviços - Rotas educacionais
app.use('/api/auth', createServiceProxy('auth'));
app.use('/api/materials', createServiceProxy('materials'));
app.use('/api/shares', createServiceProxy('shares'));

// Rotas legadas (compatibilidade retroativa com testes)
app.use('/api/products', createServiceProxy('products'));
app.use('/api/orders', createServiceProxy('orders'));

// Tratamento de Rota Não Encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
  });
});

// Tratamento de Erros Global
app.use((err, req, res, _next) => {
  logger.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
  });
});

app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
