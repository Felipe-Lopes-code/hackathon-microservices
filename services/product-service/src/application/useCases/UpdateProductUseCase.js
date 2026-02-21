// Use Case - Update Product
class UpdateProductUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(id, productData) {
    const product = await this.productRepository.findProductById(id);

    if (!product) {
      throw new Error('Product not found');
    }

    // Validate business rules
    if (productData.price !== undefined && productData.price < 0) {
      throw new Error('Price cannot be negative');
    }

    if (productData.stock !== undefined && productData.stock < 0) {
      throw new Error('Stock cannot be negative');
    }

    return await this.productRepository.updateProduct(id, productData);
  }
}

module.exports = UpdateProductUseCase;
