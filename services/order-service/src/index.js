require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const PostgresOrderRepository = require('./infrastructure/database/PostgresOrderRepository');
const CreateOrderUseCase = require('./application/useCases/CreateOrderUseCase');
const OrderController = require('./infrastructure/http/controllers/OrderController');
const createOrderRoutes = require('./infrastructure/http/routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Dependency Injection
const orderRepository = new PostgresOrderRepository();
const createOrderUseCase = new CreateOrderUseCase(orderRepository);
const orderController = new OrderController(createOrderUseCase, orderRepository);

// Routes
app.use('/api/orders', createOrderRoutes(orderController));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'share-service' });
});

// Error Handler
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`Share Service (EduShare) running on port ${PORT}`);
});

module.exports = app;
