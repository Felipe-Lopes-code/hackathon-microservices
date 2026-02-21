// Domain Entity - User
class User {
  constructor({ id, email, password, name, role, createdAt, updatedAt }) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.role = role || 'user';
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Business rules
  isAdmin() {
    return this.role === 'admin';
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

module.exports = User;
