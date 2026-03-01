// Caso de Uso - Criar Material Didático
class CreateProductUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(productData) {
    // Validar regras de negócio
    if (productData.price < 0) {
      throw new Error('Valor não pode ser negativo');
    }

    if (productData.stock < 0) {
      throw new Error('Quantidade disponível não pode ser negativa');
    }

    return await this.productRepository.createProduct(productData);
  }
}

module.exports = CreateProductUseCase;
