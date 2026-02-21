const VerifyTokenUseCase = require('../../src/application/useCases/VerifyTokenUseCase');
const User = require('../../src/domain/entities/User');
const jwt = require('jsonwebtoken');

// Set environment variables required by JWT
process.env.JWT_SECRET = 'test-secret-key-for-unit-tests';
process.env.JWT_EXPIRES_IN = '1h';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';

describe('VerifyTokenUseCase', () => {
  let verifyTokenUseCase;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      findUserById: jest.fn(),
    };
    verifyTokenUseCase = new VerifyTokenUseCase(mockRepository);
  });

  it('should verify a valid token and return user data', async () => {
    const user = new User({
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      name: 'Test User',
      role: 'user',
    });

    const validToken = jwt.sign(
      { id: 1, email: 'test@example.com', role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    mockRepository.findUserById.mockResolvedValue(user);

    const result = await verifyTokenUseCase.execute(validToken);

    expect(result).toHaveProperty('id', 1);
    expect(result).toHaveProperty('email', 'test@example.com');
    expect(result).not.toHaveProperty('password');
    expect(mockRepository.findUserById).toHaveBeenCalledWith(1);
  });

  it('should throw error for an invalid token', async () => {
    await expect(
      verifyTokenUseCase.execute('invalid-token')
    ).rejects.toThrow('Invalid token');

    expect(mockRepository.findUserById).not.toHaveBeenCalled();
  });

  it('should throw error for an expired token', async () => {
    const expiredToken = jwt.sign(
      { id: 1, email: 'test@example.com' },
      process.env.JWT_SECRET,
      { expiresIn: '0s' }
    );

    // Wait a moment to ensure token expires
    await new Promise((resolve) => setTimeout(resolve, 100));

    await expect(
      verifyTokenUseCase.execute(expiredToken)
    ).rejects.toThrow('Invalid token');
  });

  it('should throw error if user is not found in database', async () => {
    const validToken = jwt.sign(
      { id: 999 },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    mockRepository.findUserById.mockResolvedValue(null);

    await expect(
      verifyTokenUseCase.execute(validToken)
    ).rejects.toThrow('Invalid token');

    expect(mockRepository.findUserById).toHaveBeenCalledWith(999);
  });

  it('should throw error for token signed with wrong secret', async () => {
    const wrongSecretToken = jwt.sign(
      { id: 1 },
      'wrong-secret-key',
      { expiresIn: '1h' }
    );

    await expect(
      verifyTokenUseCase.execute(wrongSecretToken)
    ).rejects.toThrow('Invalid token');
  });
});
