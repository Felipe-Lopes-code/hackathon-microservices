// Domain Entity - Product
class Product {
  constructor({ id, name, description, price, stock, category, imageUrl, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.category = category;
    this.imageUrl = imageUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Business rules
  isAvailable() {
    return this.stock > 0;
  }

  canFulfillOrder(quantity) {
    return this.stock >= quantity;
  }

  decreaseStock(quantity) {
    if (!this.canFulfillOrder(quantity)) {
      throw new Error('Insufficient stock');
    }
    this.stock -= quantity;
  }

  increaseStock(quantity) {
    this.stock += quantity;
  }

  updatePrice(newPrice) {
    if (newPrice < 0) {
      throw new Error('Price cannot be negative');
    }
    this.price = newPrice;
  }
}

module.exports = Product;
