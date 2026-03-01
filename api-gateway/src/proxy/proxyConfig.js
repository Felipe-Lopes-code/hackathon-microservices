const { createProxyMiddleware } = require('http-proxy-middleware');
const logger = require('../utils/logger');

// Configuração dos Serviços da Plataforma EduShare
const services = {
  auth: {
    target: process.env.AUTH_SERVICE_URL,
    pathRewrite: (path) => path.replace('/api/auth', '/api/auth'),
  },
  materials: {
    target: process.env.PRODUCT_SERVICE_URL,
    pathRewrite: (path) => path.replace('/api/materials', '/api/products'),
  },
  shares: {
    target: process.env.ORDER_SERVICE_URL,
    pathRewrite: (path) => path.replace('/api/shares', '/api/orders'),
  },
  // Rotas legadas (compatibilidade retroativa)
  products: {
    target: process.env.PRODUCT_SERVICE_URL,
    pathRewrite: (path) => path.replace('/api/products', '/api/products'),
  },
  orders: {
    target: process.env.ORDER_SERVICE_URL,
    pathRewrite: (path) => path.replace('/api/orders', '/api/orders'),
  },
};

// Criar proxy para cada serviço
function createServiceProxy(serviceName) {
  const config = services[serviceName];

  return createProxyMiddleware({
    target: config.target,
    changeOrigin: true,
    pathRewrite: config.pathRewrite,
    onProxyReq: (proxyReq, req) => {
      logger.info(`[${serviceName}] ${req.method} ${req.path}`);
    },
    onProxyRes: (proxyRes, req) => {
      logger.info(`[${serviceName}] ${req.method} ${req.path} - ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      logger.error(`[${serviceName}] Proxy error: ${err.message}`);
      res.status(503).json({
        success: false,
        message: 'Serviço temporariamente indisponível',
      });
    },
  });
}

module.exports = { createServiceProxy };
