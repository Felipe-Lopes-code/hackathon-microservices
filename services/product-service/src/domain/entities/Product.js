// Domain Entity - Material Didático (Recurso pedagógico para professores)
class Material {
  constructor({ id, name, description, price, stock, category, imageUrl, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;              // Título do material didático
    this.description = description; // Descrição do conteúdo pedagógico
    this.price = price;            // Sempre 0 (materiais gratuitos)
    this.stock = stock;            // Quantidade disponível para compartilhamento
    this.category = category;      // Disciplina (Matemática, Português, etc.)
    this.imageUrl = imageUrl;      // Thumbnail / capa do material
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Regras de negócio
  isAvailable() {
    return this.stock > 0;
  }

  canFulfillShare(quantity) {
    return this.stock >= quantity;
  }

  decreaseStock(quantity) {
    if (!this.canFulfillShare(quantity)) {
      throw new Error('Material indisponível na quantidade solicitada');
    }
    this.stock -= quantity;
  }

  increaseStock(quantity) {
    this.stock += quantity;
  }

  updatePrice(newPrice) {
    if (newPrice < 0) {
      throw new Error('Valor não pode ser negativo');
    }
    this.price = newPrice;
  }
}

module.exports = Material;
