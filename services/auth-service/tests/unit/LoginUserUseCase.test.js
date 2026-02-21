const LoginUserUseCase = require('../../src/application/useCases/LoginUserUseCase');
const User = require('../../src/domain/entities/User');
const bcrypt = require('bcryptjs');

// Set environment variables required by JWT
process.env.JWT_SECRET = 'test-secret-key-for-unit-tests';
process.env.JWT_EXPIRES_IN = '1h';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';

describe('LoginUserUseCase', () => {
  let loginUseCase;
  let mockRepository;
  let hashedPassword;

  beforeAll(async () => {
    hashedPassword = await bcrypt.hash('password123', 10);
  });

  beforeEach(() => {
    mockRepository = {
      findUserByEmail: jest.fn(),
    };
    loginUseCase = new LoginUserUseCase(mockRepository);
  });

  it('should login successfully with correct credentials', async () => {
    const user = new User({
      id: 1,
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
      role: 'user',
    });

    mockRepository.findUserByEmail.mockResolvedValue(user);

    const result = await loginUseCase.execute({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(result.user.email).toBe('test@example.com');
    expect(result.user).not.toHaveProperty('password');
    expect(mockRepository.findUserByEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('should throw error if user is not found', async () => {
    mockRepository.findUserByEmail.mockResolvedValue(null);

    await expect(
      loginUseCase.execute({
        email: 'nonexistent@example.com',
        password: 'password123',
      })
    ).rejects.toThrow('Invalid credentials');
  });

  it('should throw error if password is incorrect', async () => {
    const user = new User({
      id: 1,
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
      role: 'user',
    });

    mockRepository.findUserByEmail.mockResolvedValue(user);

    await expect(
      loginUseCase.execute({
        email: 'test@example.com',
        password: 'wrongpassword',
      })
    ).rejects.toThrow('Invalid credentials');
  });

  it('should generate valid JWT tokens on successful login', async () => {
    const user = new User({
      id: 1,
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
      role: 'user',
    });

    mockRepository.findUserByEmail.mockResolvedValue(user);

    const result = await loginUseCase.execute({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.accessToken.split('.')).toHaveLength(3);
    expect(result.refreshToken.split('.')).toHaveLength(3);
  });

  it('should not include password in returned user object', async () => {
    const user = new User({
      id: 1,
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
      role: 'user',
    });

    mockRepository.findUserByEmail.mockResolvedValue(user);

    const result = await loginUseCase.execute({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.user).not.toHaveProperty('password');
    expect(result.user.id).toBe(1);
    expect(result.user.name).toBe('Test User');
  });
});
