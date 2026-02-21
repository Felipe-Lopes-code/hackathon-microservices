const Order = require('../../src/domain/entities/Order');

describe('Order Entity', () => {
  const validOrderData = {
    id: 1,
    userId: 42,
    items: [
      { productId: 1, name: 'Product A', price: 10, quantity: 2 },
      { productId: 2, name: 'Product B', price: 25, quantity: 1 },
    ],
    totalAmount: 45,
    status: 'pending',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  };

  it('should create an order with all properties', () => {
    const order = new Order(validOrderData);

    expect(order.id).toBe(1);
    expect(order.userId).toBe(42);
    expect(order.items).toHaveLength(2);
    expect(order.totalAmount).toBe(45);
    expect(order.status).toBe('pending');
  });

  it('should default status to "pending"', () => {
    const order = new Order({ id: 1, userId: 1, items: [], totalAmount: 0 });
    expect(order.status).toBe('pending');
  });

  it('should default items to empty array', () => {
    const order = new Order({ id: 1, userId: 1, totalAmount: 0 });
    expect(order.items).toEqual([]);
  });

  describe('Static STATUSES', () => {
    it('should define all order statuses', () => {
      expect(Order.STATUSES.PENDING).toBe('pending');
      expect(Order.STATUSES.CONFIRMED).toBe('confirmed');
      expect(Order.STATUSES.PROCESSING).toBe('processing');
      expect(Order.STATUSES.SHIPPED).toBe('shipped');
      expect(Order.STATUSES.DELIVERED).toBe('delivered');
      expect(Order.STATUSES.CANCELLED).toBe('cancelled');
    });
  });

  describe('canTransitionTo()', () => {
    it('should allow pending → confirmed', () => {
      const order = new Order({ ...validOrderData, status: 'pending' });
      expect(order.canTransitionTo('confirmed')).toBe(true);
    });

    it('should allow pending → cancelled', () => {
      const order = new Order({ ...validOrderData, status: 'pending' });
      expect(order.canTransitionTo('cancelled')).toBe(true);
    });

    it('should not allow pending → shipped', () => {
      const order = new Order({ ...validOrderData, status: 'pending' });
      expect(order.canTransitionTo('shipped')).toBe(false);
    });

    it('should allow confirmed → processing', () => {
      const order = new Order({ ...validOrderData, status: 'confirmed' });
      expect(order.canTransitionTo('processing')).toBe(true);
    });

    it('should allow confirmed → cancelled', () => {
      const order = new Order({ ...validOrderData, status: 'confirmed' });
      expect(order.canTransitionTo('cancelled')).toBe(true);
    });

    it('should allow processing → shipped', () => {
      const order = new Order({ ...validOrderData, status: 'processing' });
      expect(order.canTransitionTo('shipped')).toBe(true);
    });

    it('should allow shipped → delivered', () => {
      const order = new Order({ ...validOrderData, status: 'shipped' });
      expect(order.canTransitionTo('delivered')).toBe(true);
    });

    it('should not allow delivered → any status', () => {
      const order = new Order({ ...validOrderData, status: 'delivered' });
      expect(order.canTransitionTo('pending')).toBe(false);
      expect(order.canTransitionTo('cancelled')).toBe(false);
    });

    it('should not allow cancelled → any status', () => {
      const order = new Order({ ...validOrderData, status: 'cancelled' });
      expect(order.canTransitionTo('pending')).toBe(false);
      expect(order.canTransitionTo('confirmed')).toBe(false);
    });
  });

  describe('updateStatus()', () => {
    it('should update status for valid transition', () => {
      const order = new Order({ ...validOrderData, status: 'pending' });
      order.updateStatus('confirmed');
      expect(order.status).toBe('confirmed');
    });

    it('should throw error for invalid transition', () => {
      const order = new Order({ ...validOrderData, status: 'pending' });
      expect(() => order.updateStatus('delivered')).toThrow(
        'Cannot transition from pending to delivered'
      );
    });

    it('should support full lifecycle: pending → confirmed → processing → shipped → delivered', () => {
      const order = new Order({ ...validOrderData, status: 'pending' });

      order.updateStatus('confirmed');
      expect(order.status).toBe('confirmed');

      order.updateStatus('processing');
      expect(order.status).toBe('processing');

      order.updateStatus('shipped');
      expect(order.status).toBe('shipped');

      order.updateStatus('delivered');
      expect(order.status).toBe('delivered');
    });
  });

  describe('calculateTotal()', () => {
    it('should calculate total from items', () => {
      const order = new Order(validOrderData);
      // Item 1: 10 * 2 = 20, Item 2: 25 * 1 = 25 → Total: 45
      expect(order.calculateTotal()).toBe(45);
    });

    it('should return 0 for empty items', () => {
      const order = new Order({ ...validOrderData, items: [] });
      expect(order.calculateTotal()).toBe(0);
    });

    it('should handle single item', () => {
      const order = new Order({
        ...validOrderData,
        items: [{ productId: 1, price: 15.50, quantity: 3 }],
      });
      expect(order.calculateTotal()).toBeCloseTo(46.50);
    });
  });
});
