const Product = require('../../src/domain/entities/Product');

describe('Product Entity', () => {
  const validProductData = {
    id: 1,
    name: 'Test Product',
    description: 'A test product description',
    price: 29.99,
    stock: 100,
    category: 'electronics',
    imageUrl: 'https://example.com/image.jpg',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  };

  it('should create a product with all properties', () => {
    const product = new Product(validProductData);

    expect(product.id).toBe(1);
    expect(product.name).toBe('Test Product');
    expect(product.description).toBe('A test product description');
    expect(product.price).toBe(29.99);
    expect(product.stock).toBe(100);
    expect(product.category).toBe('electronics');
    expect(product.imageUrl).toBe('https://example.com/image.jpg');
  });

  describe('isAvailable()', () => {
    it('should return true when stock > 0', () => {
      const product = new Product({ ...validProductData, stock: 10 });
      expect(product.isAvailable()).toBe(true);
    });

    it('should return false when stock is 0', () => {
      const product = new Product({ ...validProductData, stock: 0 });
      expect(product.isAvailable()).toBe(false);
    });
  });

  describe('canFulfillOrder()', () => {
    it('should return true when stock is sufficient', () => {
      const product = new Product({ ...validProductData, stock: 10 });
      expect(product.canFulfillOrder(5)).toBe(true);
    });

    it('should return true when stock equals quantity', () => {
      const product = new Product({ ...validProductData, stock: 5 });
      expect(product.canFulfillOrder(5)).toBe(true);
    });

    it('should return false when stock is insufficient', () => {
      const product = new Product({ ...validProductData, stock: 3 });
      expect(product.canFulfillOrder(5)).toBe(false);
    });
  });

  describe('decreaseStock()', () => {
    it('should decrease stock by the given quantity', () => {
      const product = new Product({ ...validProductData, stock: 10 });
      product.decreaseStock(3);
      expect(product.stock).toBe(7);
    });

    it('should throw error when insufficient stock', () => {
      const product = new Product({ ...validProductData, stock: 2 });
      expect(() => product.decreaseStock(5)).toThrow('Insufficient stock');
    });
  });

  describe('increaseStock()', () => {
    it('should increase stock by the given quantity', () => {
      const product = new Product({ ...validProductData, stock: 10 });
      product.increaseStock(5);
      expect(product.stock).toBe(15);
    });
  });

  describe('updatePrice()', () => {
    it('should update price to a new valid value', () => {
      const product = new Product({ ...validProductData, price: 10 });
      product.updatePrice(25.50);
      expect(product.price).toBe(25.50);
    });

    it('should throw error for negative price', () => {
      const product = new Product(validProductData);
      expect(() => product.updatePrice(-5)).toThrow('Price cannot be negative');
    });

    it('should allow price to be set to 0', () => {
      const product = new Product(validProductData);
      product.updatePrice(0);
      expect(product.price).toBe(0);
    });
  });
});
