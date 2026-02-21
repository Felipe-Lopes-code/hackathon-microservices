const axios = require('axios');

// Use Case - Create Order
class CreateOrderUseCase {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(userId, orderData) {
    // Validate items with Product Service
    const items = await this._validateAndFetchItems(orderData.items);

    // Calculate total
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create order
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
            throw new Error(`Product ${product.name} is not available in requested quantity`);
          }

          validatedItems.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
          });
        }
      } catch (error) {
        throw new Error(`Failed to validate product ${item.productId}: ${error.message}`);
      }
    }

    return validatedItems;
  }
}

module.exports = CreateOrderUseCase;
