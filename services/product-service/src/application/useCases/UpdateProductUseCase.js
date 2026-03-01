// Caso de Uso - Atualizar Material Didático
class UpdateProductUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(id, productData) {
    const product = await this.productRepository.findProductById(id);

    if (!product) {
      throw new Error('Material não encontrado');
    }

    // Validar regras de negócio
    if (productData.price !== undefined && productData.price < 0) {
      throw new Error('Valor não pode ser negativo');
    }

    if (productData.stock !== undefined && productData.stock < 0) {
      throw new Error('Quantidade disponível não pode ser negativa');
    }

    return await this.productRepository.updateProduct(id, productData);
  }
}

module.exports = UpdateProductUseCase;
