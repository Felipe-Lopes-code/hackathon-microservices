require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const PostgresProductRepository = require('./infrastructure/database/PostgresProductRepository');
const CreateProductUseCase = require('./application/useCases/CreateProductUseCase');
const GetAllProductsUseCase = require('./application/useCases/GetAllProductsUseCase');
const UpdateProductUseCase = require('./application/useCases/UpdateProductUseCase');
const ProductController = require('./infrastructure/http/controllers/ProductController');
const createProductRoutes = require('./infrastructure/http/routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Dependency Injection
const productRepository = new PostgresProductRepository();
const createProductUseCase = new CreateProductUseCase(productRepository);
const getAllProductsUseCase = new GetAllProductsUseCase(productRepository);
const updateProductUseCase = new UpdateProductUseCase(productRepository);
const productController = new ProductController(
  createProductUseCase,
  getAllProductsUseCase,
  updateProductUseCase,
  productRepository
);

// Routes
app.use('/api/products', createProductRoutes(productController));

// Global Error Handler
app.use((err, req, res, _next) => {
  console.error(err.stack);
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
  console.log(`Product Service running on port ${PORT}`);
});

module.exports = app;
