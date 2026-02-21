// Domain Entity - Material (Didactic Material for teachers)
class Material {
  constructor({ id, name, description, price, stock, category, imageUrl, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;              // Material title
    this.description = description; // Material description
    this.price = price;            // Always 0 (free materials)
    this.stock = stock;            // Download count / availability
    this.category = category;      // Discipline (Matemática, Português, etc.)
    this.imageUrl = imageUrl;      // Material thumbnail
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

module.exports = Material;
