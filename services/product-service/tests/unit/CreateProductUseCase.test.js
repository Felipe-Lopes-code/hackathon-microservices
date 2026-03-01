const CreateProductUseCase = require('../../src/application/useCases/CreateProductUseCase');

describe('CreateProductUseCase', () => {
  let createProductUseCase;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      createProduct: jest.fn(),
    };
    createProductUseCase = new CreateProductUseCase(mockRepository);
  });

  it('should create a product successfully', async () => {
    const productData = {
      name: 'Apostila de Geometria',
      description: 'Material sobre geometria plana',
      price: 29.99,
      stock: 50,
      category: 'Matemática',
    };

    const expectedProduct = { id: 1, ...productData };
    mockRepository.createProduct.mockResolvedValue(expectedProduct);

    const result = await createProductUseCase.execute(productData);

    expect(result).toEqual(expectedProduct);
    expect(mockRepository.createProduct).toHaveBeenCalledWith(productData);
  });

  it('should throw error for negative price', async () => {
    const productData = {
      name: 'Apostila de Geometria',
      price: -10,
      stock: 5,
    };

    await expect(createProductUseCase.execute(productData)).rejects.toThrow(
      'Valor não pode ser negativo'
    );
    expect(mockRepository.createProduct).not.toHaveBeenCalled();
  });

  it('should throw error for negative stock', async () => {
    const productData = {
      name: 'Apostila de Geometria',
      price: 10,
      stock: -5,
    };

    await expect(createProductUseCase.execute(productData)).rejects.toThrow(
      'Quantidade disponível não pode ser negativa'
    );
    expect(mockRepository.createProduct).not.toHaveBeenCalled();
  });

  it('should allow zero price', async () => {
    const productData = {
      name: 'Material Gratuito',
      price: 0,
      stock: 10,
    };

    mockRepository.createProduct.mockResolvedValue({ id: 1, ...productData });

    const result = await createProductUseCase.execute(productData);
    expect(result).toHaveProperty('id');
    expect(mockRepository.createProduct).toHaveBeenCalledWith(productData);
  });

  it('should allow zero stock', async () => {
    const productData = {
      name: 'Material Esgotado',
      price: 10,
      stock: 0,
    };

    mockRepository.createProduct.mockResolvedValue({ id: 1, ...productData });

    const result = await createProductUseCase.execute(productData);
    expect(result).toHaveProperty('id');
    expect(mockRepository.createProduct).toHaveBeenCalledWith(productData);
  });
});
