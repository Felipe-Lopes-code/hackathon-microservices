// Domain Entity - Order
class Order {
  constructor({ id, userId, items, totalAmount, status, createdAt, updatedAt }) {
    this.id = id;
    this.userId = userId;
    this.items = items || [];
    this.totalAmount = totalAmount;
    this.status = status || 'pending';
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Order Status Flow: pending -> confirmed -> processing -> shipped -> delivered
  static STATUSES = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
  };

  canTransitionTo(newStatus) {
    const transitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: [],
    };

    return transitions[this.status]?.includes(newStatus) || false;
  }

  updateStatus(newStatus) {
    if (!this.canTransitionTo(newStatus)) {
      throw new Error(`Cannot transition from ${this.status} to ${newStatus}`);
    }
    this.status = newStatus;
  }

  calculateTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}

module.exports = Order;
