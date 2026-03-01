// Domain Entity - Compartilhamento (Distribuição de materiais entre professores e alunos)
class Share {
  constructor({ id, userId, items, totalAmount, status, createdAt, updatedAt }) {
    this.id = id;
    this.userId = userId;           // ID do professor que solicita o compartilhamento
    this.items = items || [];       // Lista de materiais compartilhados
    this.totalAmount = totalAmount; // Quantidade total de materiais
    this.status = status || 'pending'; // Status da solicitação de compartilhamento
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Fluxo de Status: pending -> confirmed -> processing -> distributed -> completed
  static STATUSES = {
    PENDING: 'pending',        // Solicitação enviada
    CONFIRMED: 'confirmed',    // Solicitação aprovada
    PROCESSING: 'processing',  // Materiais sendo preparados
    SHIPPED: 'shipped',        // Materiais distribuídos
    DELIVERED: 'delivered',    // Compartilhamento concluído
    CANCELLED: 'cancelled',   // Solicitação cancelada
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
      throw new Error(`Não é possível transicionar de ${this.status} para ${newStatus}`);
    }
    this.status = newStatus;
  }

  calculateTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}

module.exports = Share;
