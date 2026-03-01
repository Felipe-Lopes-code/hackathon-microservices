const axios = require('axios');

// Caso de Uso - Criar Solicitação de Compartilhamento de Materiais
class CreateOrderUseCase {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(userId, orderData) {
    // Validar materiais com o Serviço de Materiais
    const items = await this._validateAndFetchItems(orderData.items);

    // Calcular total de materiais
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Criar solicitação de compartilhamento
    const order = await this.orderRepository.createOrder({
      userId,
      items,
      totalAmount,
      status: 'pending',
    });

    return order;
  }

  async _validateAndFetchItems(items) {
    const validatedItems = [];

    for (const item of items) {
      try {
        const response = await axios.get(
          `${process.env.PRODUCT_SERVICE_URL}/api/products/${item.productId}`
        );

        if (response.data.success) {
          const product = response.data.data;

          if (!product.isAvailable || product.stock < item.quantity) {
            throw new Error(`Material ${product.name} não está disponível na quantidade solicitada`);
          }

          validatedItems.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
          });
        }
      } catch (error) {
        throw new Error(`Falha ao validar material ${item.productId}: ${error.message}`);
      }
    }

    return validatedItems;
  }
}

module.exports = CreateOrderUseCase;
