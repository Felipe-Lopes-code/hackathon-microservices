// Use Case - Get All Products
class GetAllProductsUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(filters = {}) {
    return await this.productRepository.findAllProducts(filters);
  }
}

module.exports = GetAllProductsUseCase;
