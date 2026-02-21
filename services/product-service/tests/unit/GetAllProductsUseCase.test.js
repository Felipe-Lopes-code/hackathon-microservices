const GetAllProductsUseCase = require('../../src/application/useCases/GetAllProductsUseCase');

describe('GetAllProductsUseCase', () => {
  let getAllProductsUseCase;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      findAllProducts: jest.fn(),
    };
    getAllProductsUseCase = new GetAllProductsUseCase(mockRepository);
  });

  it('should return all products without filters', async () => {
    const products = [
      { id: 1, name: 'Product 1', price: 10 },
      { id: 2, name: 'Product 2', price: 20 },
    ];

    mockRepository.findAllProducts.mockResolvedValue(products);

    const result = await getAllProductsUseCase.execute();

    expect(result).toEqual(products);
    expect(result).toHaveLength(2);
    expect(mockRepository.findAllProducts).toHaveBeenCalledWith({});
  });

  it('should pass filters to repository', async () => {
    const filters = {
      category: 'electronics',
      minPrice: 10,
      maxPrice: 100,
    };

    mockRepository.findAllProducts.mockResolvedValue([]);

    await getAllProductsUseCase.execute(filters);

    expect(mockRepository.findAllProducts).toHaveBeenCalledWith(filters);
  });

  it('should return empty array when no products match', async () => {
    mockRepository.findAllProducts.mockResolvedValue([]);

    const result = await getAllProductsUseCase.execute({ category: 'nonexistent' });

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle filters with limit', async () => {
    const products = [{ id: 1, name: 'Product 1' }];
    mockRepository.findAllProducts.mockResolvedValue(products);

    const result = await getAllProductsUseCase.execute({ limit: 1 });

    expect(result).toHaveLength(1);
    expect(mockRepository.findAllProducts).toHaveBeenCalledWith({ limit: 1 });
  });
});
