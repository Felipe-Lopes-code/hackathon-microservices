// Domain Repository Interface
class IProductRepository {
  async createProduct(product) {
    throw new Error('Method not implemented');
  }

  async findProductById(id) {
    throw new Error('Method not implemented');
  }

  async findAllProducts(filters) {
    throw new Error('Method not implemented');
  }

  async updateProduct(id, data) {
    throw new Error('Method not implemented');
  }

  async deleteProduct(id) {
    throw new Error('Method not implemented');
  }

  async updateStock(id, quantity) {
    throw new Error('Method not implemented');
  }
}

module.exports = IProductRepository;
