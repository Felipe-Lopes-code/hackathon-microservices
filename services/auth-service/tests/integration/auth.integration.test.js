const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

// Set environment variables before loading any modules
process.env.JWT_SECRET = 'integration-test-secret-key';
process.env.JWT_EXPIRES_IN = '1h';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';

const User = require('../../src/domain/entities/User');
const RegisterUserUseCase = require('../../src/application/useCases/RegisterUserUseCase');
const LoginUserUseCase = require('../../src/application/useCases/LoginUserUseCase');
const VerifyTokenUseCase = require('../../src/application/useCases/VerifyTokenUseCase');
const AuthController = require('../../src/infrastructure/http/controllers/AuthController');
const createAuthRoutes = require('../../src/infrastructure/http/routes/authRoutes');

/**
 * Auth API Integration Tests
 *
 * Tests the full HTTP layer (routes → validators → controllers → use cases)
 * with an in-memory mock repository (no database dependency)
 */
describe('Auth API Integration Tests', () => {
  let app;
  let mockRepository;
  let usersDb;

  beforeAll(async () => {
    // In-memory user store
    usersDb = new Map();
    let nextId = 1;

    mockRepository = {
      findUserByEmail: jest.fn(async (email) => {
        for (const user of usersDb.values()) {
          if (user.email === email) return user;
        }
        return null;
      }),
      createUser: jest.fn(async (userData) => {
        const user = new User({
          id: nextId++,
          email: userData.email,
          password: userData.password,
          name: userData.name,
          role: userData.role || 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        usersDb.set(user.id, user);
        return user;
      }),
      findUserById: jest.fn(async (id) => {
        return usersDb.get(id) || null;
      }),
    };

    // Build Express app with mocked dependencies
    const registerUseCase = new RegisterUserUseCase(mockRepository);
    const loginUseCase = new LoginUserUseCase(mockRepository);
    const verifyTokenUseCase = new VerifyTokenUseCase(mockRepository);
    const authController = new AuthController(registerUseCase, loginUseCase, verifyTokenUseCase);

    app = express();
    app.use(express.json());
    app.use('/api/auth', createAuthRoutes(authController));

    // 404 Handler
    app.use((req, res) => {
      res.status(404).json({ success: false, message: 'Route not found' });
    });
  });

  const testUser = {
    name: 'Integration Test User',
    email: 'integration-test@example.com',
    password: 'testpassword123',
  };

  let authToken;
  let userId;

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user).not.toHaveProperty('password');

      authToken = response.body.data.accessToken;
      userId = response.body.data.user.id;
    });

    it('should not register user with existing email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...testUser,
          email: 'invalid-email',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should validate password length', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...testUser,
          email: 'another@test.com',
          password: '123',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should validate name is required', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'noname@test.com',
          password: 'password123',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(testUser.email);
    });

    it('should not login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'somepassword',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should validate email format on login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'not-an-email',
          password: 'password123',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user).toHaveProperty('email');
    });

    it('should not get profile without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not get profile with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not get profile with malformed Authorization header', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'NotBearer token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/verify', () => {
    it('should verify valid token', async () => {
      const response = await request(app)
        .post('/api/auth/verify')
        .send({ token: authToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
    });

    it('should not verify invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/verify')
        .send({ token: 'invalid-token' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not verify expired token', async () => {
      const expiredToken = jwt.sign(
        { id: 1, email: 'test@example.com' },
        process.env.JWT_SECRET,
        { expiresIn: '0s' }
      );

      // Wait for token to expire
      await new Promise((resolve) => setTimeout(resolve, 100));

      const response = await request(app)
        .post('/api/auth/verify')
        .send({ token: expiredToken })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/auth/health')
        .expect(200);

      expect(response.body.status).toBe('ok');
      expect(response.body.service).toBe('auth-service');
    });
  });
});
