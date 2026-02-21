// Domain Repository Interface
class IAuthRepository {
  async createUser(user) {
    throw new Error('Method not implemented');
  }

  async findUserByEmail(email) {
    throw new Error('Method not implemented');
  }

  async findUserById(id) {
    throw new Error('Method not implemented');
  }

  async updateUser(id, data) {
    throw new Error('Method not implemented');
  }

  async deleteUser(id) {
    throw new Error('Method not implemented');
  }
}

module.exports = IAuthRepository;
