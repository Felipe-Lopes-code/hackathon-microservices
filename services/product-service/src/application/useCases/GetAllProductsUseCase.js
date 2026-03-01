// Caso de Uso - Listar Materiais Didáticos
class GetAllProductsUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(filters = {}) {
    return await this.productRepository.findAllProducts(filters);
  }
}

module.exports = GetAllProductsUseCase;
