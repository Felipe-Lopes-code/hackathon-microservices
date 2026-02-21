// Use Case - Create Product
class CreateProductUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(productData) {
    // Validate business rules
    if (productData.price < 0) {
      throw new Error('Price cannot be negative');
    }

    if (productData.stock < 0) {
      throw new Error('Stock cannot be negative');
    }

    return await this.productRepository.createProduct(productData);
  }
}

module.exports = CreateProductUseCase;
