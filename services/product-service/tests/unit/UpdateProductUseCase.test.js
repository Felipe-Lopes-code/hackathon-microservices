const UpdateProductUseCase = require('../../src/application/useCases/UpdateProductUseCase');

describe('UpdateProductUseCase', () => {
  let updateProductUseCase;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      findProductById: jest.fn(),
      updateProduct: jest.fn(),
    };
    updateProductUseCase = new UpdateProductUseCase(mockRepository);
  });

  it('should update a product successfully', async () => {
    const existingProduct = { id: 1, name: 'Old Name', price: 10, stock: 5 };
    const updateData = { name: 'New Name', price: 15 };
    const updatedProduct = { ...existingProduct, ...updateData };

    mockRepository.findProductById.mockResolvedValue(existingProduct);
    mockRepository.updateProduct.mockResolvedValue(updatedProduct);

    const result = await updateProductUseCase.execute(1, updateData);

    expect(result.name).toBe('New Name');
    expect(result.price).toBe(15);
    expect(mockRepository.findProductById).toHaveBeenCalledWith(1);
    expect(mockRepository.updateProduct).toHaveBeenCalledWith(1, updateData);
  });

  it('should throw error when product is not found', async () => {
    mockRepository.findProductById.mockResolvedValue(null);

    await expect(
      updateProductUseCase.execute(999, { name: 'New Name' })
    ).rejects.toThrow('Product not found');

    expect(mockRepository.updateProduct).not.toHaveBeenCalled();
  });

  it('should throw error for negative price', async () => {
    mockRepository.findProductById.mockResolvedValue({ id: 1, name: 'Product', price: 10 });

    await expect(
      updateProductUseCase.execute(1, { price: -5 })
    ).rejects.toThrow('Price cannot be negative');

    expect(mockRepository.updateProduct).not.toHaveBeenCalled();
  });

  it('should throw error for negative stock', async () => {
    mockRepository.findProductById.mockResolvedValue({ id: 1, name: 'Product', stock: 10 });

    await expect(
      updateProductUseCase.execute(1, { stock: -3 })
    ).rejects.toThrow('Stock cannot be negative');

    expect(mockRepository.updateProduct).not.toHaveBeenCalled();
  });

  it('should allow updating only the name', async () => {
    const existingProduct = { id: 1, name: 'Old', price: 10, stock: 5 };
    const updatedProduct = { ...existingProduct, name: 'New' };

    mockRepository.findProductById.mockResolvedValue(existingProduct);
    mockRepository.updateProduct.mockResolvedValue(updatedProduct);

    const result = await updateProductUseCase.execute(1, { name: 'New' });

    expect(result.name).toBe('New');
  });

  it('should allow price of zero', async () => {
    const existingProduct = { id: 1, name: 'Product', price: 10 };
    mockRepository.findProductById.mockResolvedValue(existingProduct);
    mockRepository.updateProduct.mockResolvedValue({ ...existingProduct, price: 0 });

    const result = await updateProductUseCase.execute(1, { price: 0 });
    expect(result.price).toBe(0);
  });

  it('should allow stock of zero', async () => {
    const existingProduct = { id: 1, name: 'Product', stock: 10 };
    mockRepository.findProductById.mockResolvedValue(existingProduct);
    mockRepository.updateProduct.mockResolvedValue({ ...existingProduct, stock: 0 });

    const result = await updateProductUseCase.execute(1, { stock: 0 });
    expect(result.stock).toBe(0);
  });
});
