const RegisterUserUseCase = require('../../src/application/useCases/RegisterUserUseCase');
const User = require('../../src/domain/entities/User');

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
    expect(mockRepository.findUserByEmail).toHaveBeenCalledWith(userData.email);
  });

  it('should throw error if user already exists', async () => {
    const userData = {
      email: 'existing@example.com',
      password: 'password123',
      name: 'Existing User',
    };

    mockRepository.findUserByEmail.mockResolvedValue(new User({ id: 1, ...userData }));

    await expect(registerUseCase.execute(userData)).rejects.toThrow('User already exists');
  });
});
