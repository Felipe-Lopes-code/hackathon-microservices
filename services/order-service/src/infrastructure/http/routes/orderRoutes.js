const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

function createOrderRoutes(orderController) {
  const router = express.Router();

  // All routes require authentication
  router.use(authMiddleware);

  router.post('/', (req, res) => orderController.createOrder(req, res));
  router.get('/my-orders', (req, res) => orderController.getMyOrders(req, res));
  router.get('/:id', (req, res) => orderController.getOrderById(req, res));
  router.patch('/:id/status', (req, res) => orderController.updateOrderStatus(req, res));

  return router;
}

module.exports = createOrderRoutes;
