// Domain Entity - Share (Material Sharing between teachers and students)
class Share {
  constructor({ id, userId, items, totalAmount, status, createdAt, updatedAt }) {
    this.id = id;
    this.userId = userId;           // Teacher ID who initiates the share
    this.items = items || [];       // Shared materials list
    this.totalAmount = totalAmount; // Number of materials shared
    this.status = status || 'pending'; // Share request status
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Share Status Flow: pending -> confirmed -> processing -> active -> completed
  static STATUSES = {
    PENDING: 'pending',        // Share request submitted
    CONFIRMED: 'confirmed',    // Share approved
    PROCESSING: 'processing',  // Share being prepared
    SHIPPED: 'shipped',        // Share distributed (active)
    DELIVERED: 'delivered',    // Share completed
    CANCELLED: 'cancelled',   // Share cancelled
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

module.exports = Share;
