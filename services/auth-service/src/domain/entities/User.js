// Entidade de Domínio - Usuário (Professor/Aluno da plataforma EduShare)
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

  // Regras de negócio
  isAdmin() {
    return this.role === 'admin';
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

module.exports = User;
