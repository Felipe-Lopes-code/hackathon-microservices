const User = require('../../src/domain/entities/User');

describe('User Entity', () => {
  it('should create a user with all properties', () => {
    const userData = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      name: 'Test User',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const user = new User(userData);

    expect(user.id).toBe(1);
    expect(user.email).toBe('test@example.com');
    expect(user.password).toBe('hashedPassword');
    expect(user.name).toBe('Test User');
    expect(user.role).toBe('admin');
    expect(user.createdAt).toEqual(userData.createdAt);
    expect(user.updatedAt).toEqual(userData.updatedAt);
  });

  it('should default role to "user" if not provided', () => {
    const user = new User({
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      name: 'Test User',
    });

    expect(user.role).toBe('user');
  });

  describe('isAdmin()', () => {
    it('should return true for admin role', () => {
      const user = new User({ id: 1, email: 'a@b.com', name: 'Admin', role: 'admin' });
      expect(user.isAdmin()).toBe(true);
    });

    it('should return false for non-admin role', () => {
      const user = new User({ id: 1, email: 'a@b.com', name: 'User', role: 'user' });
      expect(user.isAdmin()).toBe(false);
    });

    it('should return false for default role', () => {
      const user = new User({ id: 1, email: 'a@b.com', name: 'User' });
      expect(user.isAdmin()).toBe(false);
    });
  });

  describe('toJSON()', () => {
    it('should exclude password from JSON representation', () => {
      const user = new User({
        id: 1,
        email: 'test@example.com',
        password: 'secretPassword',
        name: 'Test User',
        role: 'user',
      });

      const json = user.toJSON();

      expect(json).not.toHaveProperty('password');
      expect(json).toHaveProperty('id', 1);
      expect(json).toHaveProperty('email', 'test@example.com');
      expect(json).toHaveProperty('name', 'Test User');
      expect(json).toHaveProperty('role', 'user');
    });

    it('should preserve all non-password properties', () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');

      const user = new User({
        id: 42,
        email: 'admin@test.com',
        password: 'hashed',
        name: 'Admin User',
        role: 'admin',
        createdAt,
        updatedAt,
      });

      const json = user.toJSON();

      expect(json.id).toBe(42);
      expect(json.email).toBe('admin@test.com');
      expect(json.name).toBe('Admin User');
      expect(json.role).toBe('admin');
      expect(json.createdAt).toEqual(createdAt);
      expect(json.updatedAt).toEqual(updatedAt);
    });
  });
});
