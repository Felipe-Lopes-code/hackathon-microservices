const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

function createProductRoutes(productController) {
  const router = express.Router();

  // Rotas públicas - catálogo de materiais
  router.get('/', (req, res) => productController.getAllProducts(req, res));
  router.get('/:id', (req, res) => productController.getProductById(req, res));

  // Rotas protegidas (requer autenticação de professor)
  router.post('/', authMiddleware, (req, res) => productController.createProduct(req, res));
  router.put('/:id', authMiddleware, (req, res) => productController.updateProduct(req, res));
  router.delete('/:id', authMiddleware, (req, res) => productController.deleteProduct(req, res));

  // Health check
  router.get('/health/check', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'product-service' });
  });

  return router;
}

module.exports = createProductRoutes;
