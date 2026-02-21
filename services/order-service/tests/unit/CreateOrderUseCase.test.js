const CreateOrderUseCase = require('../../src/application/useCases/CreateOrderUseCase');

// Mock axios
jest.mock('axios');
const axios = require('axios');

process.env.PRODUCT_SERVICE_URL = 'http://localhost:3002';

describe('CreateOrderUseCase', () => {
  let createOrderUseCase;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      createOrder: jest.fn(),
    };
    createOrderUseCase = new CreateOrderUseCase(mockRepository);
    jest.clearAllMocks();
  });

  it('should create an order successfully', async () => {
    const orderData = {
      items: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 },
      ],
    };

    // Mock product service responses
    axios.get
      .mockResolvedValueOnce({
        data: {
          success: true,
          data: { id: 1, name: 'Product A', price: 10, isAvailable: true, stock: 50 },
        },
      })
      .mockResolvedValueOnce({
        data: {
          success: true,
          data: { id: 2, name: 'Product B', price: 25, isAvailable: true, stock: 30 },
        },
      });

    const createdOrder = {
      id: 1,
      userId: 42,
      items: [
        { productId: 1, name: 'Product A', price: 10, quantity: 2 },
        { productId: 2, name: 'Product B', price: 25, quantity: 1 },
      ],
      totalAmount: 45,
      status: 'pending',
    };

    mockRepository.createOrder.mockResolvedValue(createdOrder);

    const result = await createOrderUseCase.execute(42, orderData);

    expect(result).toEqual(createdOrder);
    expect(result.totalAmount).toBe(45);
    expect(result.status).toBe('pending');
    expect(mockRepository.createOrder).toHaveBeenCalledTimes(1);

    // Verify the created order data
    const createOrderCall = mockRepository.createOrder.mock.calls[0][0];
    expect(createOrderCall.userId).toBe(42);
    expect(createOrderCall.status).toBe('pending');
    expect(createOrderCall.totalAmount).toBe(45);
  });

  it('should throw error when product is not available', async () => {
    const orderData = {
      items: [{ productId: 1, quantity: 100 }],
    };

    axios.get.mockResolvedValue({
      data: {
        success: true,
        data: { id: 1, name: 'Product A', price: 10, isAvailable: false, stock: 5 },
      },
    });

    await expect(
      createOrderUseCase.execute(42, orderData)
    ).rejects.toThrow('not available');
  });

  it('should throw error when product service fails', async () => {
    const orderData = {
      items: [{ productId: 999, quantity: 1 }],
    };

    axios.get.mockRejectedValue(new Error('Connection refused'));

    await expect(
      createOrderUseCase.execute(42, orderData)
    ).rejects.toThrow('Failed to validate product');
  });

  it('should calculate total amount correctly', async () => {
    const orderData = {
      items: [
        { productId: 1, quantity: 3 },
      ],
    };

    axios.get.mockResolvedValue({
      data: {
        success: true,
        data: { id: 1, name: 'Product', price: 15.50, isAvailable: true, stock: 100 },
      },
    });

    mockRepository.createOrder.mockImplementation(async (data) => ({
      id: 1,
      ...data,
    }));

    const result = await createOrderUseCase.execute(42, orderData);

    const createOrderCall = mockRepository.createOrder.mock.calls[0][0];
    expect(createOrderCall.totalAmount).toBeCloseTo(46.50);
  });

  it('should validate each item with the product service', async () => {
    const orderData = {
      items: [
        { productId: 1, quantity: 1 },
        { productId: 2, quantity: 2 },
      ],
    };

    axios.get
      .mockResolvedValueOnce({
        data: { success: true, data: { id: 1, name: 'P1', price: 10, isAvailable: true, stock: 5 } },
      })
      .mockResolvedValueOnce({
        data: { success: true, data: { id: 2, name: 'P2', price: 20, isAvailable: true, stock: 5 } },
      });

    mockRepository.createOrder.mockResolvedValue({ id: 1 });

    await createOrderUseCase.execute(42, orderData);

    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(axios.get).toHaveBeenCalledWith(
      `${process.env.PRODUCT_SERVICE_URL}/api/products/1`
    );
    expect(axios.get).toHaveBeenCalledWith(
      `${process.env.PRODUCT_SERVICE_URL}/api/products/2`
    );
  });
});
