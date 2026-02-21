const RegisterUserUseCase = require('../../src/application/useCases/RegisterUserUseCase');
const User = require('../../src/domain/entities/User');

// Set environment variables required by JWT
process.env.JWT_SECRET = 'test-secret-key-for-unit-tests';
process.env.JWT_EXPIRES_IN = '1h';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';

describe('RegisterUserUseCase', () => {
  let registerUseCase;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      findUserByEmail: jest.fn(),
      createUser: jest.fn(),
    };
    registerUseCase = new RegisterUserUseCase(mockRepository);
  });

  it('should register a new user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    mockRepository.findUserByEmail.mockResolvedValue(null);
    mockRepository.createUser.mockResolvedValue(
      new User({ id: 1, ...userData, role: 'user' })
    );

    const result = await registerUseCase.execute(userData);

    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(result.user).not.toHaveProperty('password');
    expect(result.user.email).toBe(userData.email);
    expect(result.user.name).toBe(userData.name);
    expect(mockRepository.findUserByEmail).toHaveBeenCalledWith(userData.email);
    expect(mockRepository.createUser).toHaveBeenCalledTimes(1);
  });

  it('should throw error if user already exists', async () => {
    const userData = {
      email: 'existing@example.com',
      password: 'password123',
      name: 'Existing User',
    };

    mockRepository.findUserByEmail.mockResolvedValue(new User({ id: 1, ...userData }));

    await expect(registerUseCase.execute(userData)).rejects.toThrow('User already exists');
    expect(mockRepository.createUser).not.toHaveBeenCalled();
  });

  it('should hash the password before storing', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'plainTextPassword',
      name: 'Test User',
    };

    mockRepository.findUserByEmail.mockResolvedValue(null);
    mockRepository.createUser.mockImplementation(async (data) => {
      return new User({ id: 1, ...data, role: 'user' });
    });

    await registerUseCase.execute(userData);

    const createUserArg = mockRepository.createUser.mock.calls[0][0];
    expect(createUserArg.password).not.toBe(userData.password);
    expect(createUserArg.password.length).toBeGreaterThan(20); // bcrypt hash
  });

  it('should generate valid JWT tokens', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    mockRepository.findUserByEmail.mockResolvedValue(null);
    mockRepository.createUser.mockResolvedValue(
      new User({ id: 1, ...userData, role: 'user' })
    );

    const result = await registerUseCase.execute(userData);

    // JWT tokens are base64 encoded with 3 parts separated by dots
    expect(result.accessToken.split('.')).toHaveLength(3);
    expect(result.refreshToken.split('.')).toHaveLength(3);
  });
});
