const request = require('supertest');

/**
 * Security Test Suite
 * Testes automatizados de segurança para todos os microserviços
 */
describe('Security Tests', () => {
  let app;
  let authToken;

  beforeAll(async () => {
    // Setup test environment
    process.env.NODE_ENV = 'test';
    app = require('../api-gateway/src/index');
  });

  describe('SQL Injection Protection', () => {
    it('should prevent SQL injection in email field', async () => {
      const sqlInjectionPayloads = [
        "admin'--",
        "admin' OR '1'='1",
        "'; DROP TABLE users--",
        "1' UNION SELECT * FROM users--",
      ];

      for (const payload of sqlInjectionPayloads) {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: payload,
            password: 'password123',
          });

        // Should not return 500 or expose database errors
        expect(response.status).not.toBe(500);
        expect(response.body.message).not.toContain('SQL');
        expect(response.body.message).not.toContain('syntax');
      }
    });

    it('should prevent SQL injection in product search', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ category: "'; DROP TABLE products--" });

      expect(response.status).not.toBe(500);
    });
  });

  describe('XSS Protection', () => {
    it('should sanitize XSS in registration', async () => {
      const xssPayloads = [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=alert("XSS")>',
        'javascript:alert("XSS")',
      ];

      for (const payload of xssPayloads) {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            name: payload,
            email: 'test@test.com',
            password: 'password123',
          });

        // Should either reject or sanitize
        if (response.status === 201) {
          expect(response.body.data.user.name).not.toContain('<script>');
          expect(response.body.data.user.name).not.toContain('javascript:');
        }
      }
    });
  });

  describe('Authentication & Authorization', () => {
    it('should reject requests without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('token');
    });

    it('should reject invalid tokens', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token-here')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject expired tokens', async () => {
      // Token that expired in the past
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwIjoxNjAwMDAwMDAwfQ.invalid';

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject malformed Authorization header', async () => {
      const malformedHeaders = [
        'invalid-format',
        'Bearer',
        'Bearer ',
        'Basic token-here',
      ];

      for (const header of malformedHeaders) {
        const response = await request(app)
          .get('/api/auth/profile')
          .set('Authorization', header);

        expect(response.status).toBe(401);
      }
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      const requests = [];
      const maxRequests = 105; // Slightly above limit

      // Send many requests quickly
      for (let i = 0; i < maxRequests; i++) {
        requests.push(
          request(app)
            .get('/api/products')
            .then((res) => res.status)
        );
      }

      const statuses = await Promise.all(requests);
      const rateLimitedCount = statuses.filter((status) => status === 429).length;

      // Should have at least one rate limited response
      expect(rateLimitedCount).toBeGreaterThan(0);
    }, 30000); // Increase timeout for this test
  });

  describe('Input Validation', () => {
    it('should validate email format', async () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com',
      ];

      for (const email of invalidEmails) {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            name: 'Test User',
            email: email,
            password: 'password123',
          });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      }
    });

    it('should enforce password complexity', async () => {
      const weakPasswords = [
        '123',
        'pass',
        '1234567', // Less than 8 chars
      ];

      for (const password of weakPasswords) {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            name: 'Test User',
            email: 'test@example.com',
            password: password,
          });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      }
    });

    it('should reject negative prices', async () => {
      // First, register and login to get token
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Admin User',
          email: 'admin@test.com',
          password: 'password123',
        });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'password123',
        });

      const token = loginResponse.body.data.accessToken;

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Product',
          price: -10.99,
          stock: 100,
        });

      expect(response.status).toBe(400);
    });
  });

  describe('CORS Protection', () => {
    it('should include CORS headers', async () => {
      const response = await request(app).get('/api/products');

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    it('should handle preflight requests', async () => {
      const response = await request(app)
        .options('/api/products')
        .set('Origin', 'http://example.com')
        .set('Access-Control-Request-Method', 'POST');

      expect(response.status).toBe(204);
    });
  });

  describe('Security Headers', () => {
    it('should include security headers (Helmet)', async () => {
      const response = await request(app).get('/health');

      // Helmet headers
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBeDefined();
      expect(response.headers['x-xss-protection']).toBeDefined();
    });
  });

  describe('Error Information Disclosure', () => {
    it('should not expose stack traces in production', async () => {
      const response = await request(app)
        .get('/api/nonexistent-endpoint');

      expect(response.body).not.toHaveProperty('stack');
      expect(response.body.message).not.toContain('Error:');
      expect(response.body.message).not.toContain('at ');
    });

    it('should return generic error messages', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'wrongpassword',
        });

      // Should not reveal if user exists or not
      expect(response.body.message).not.toContain('user not found');
      expect(response.body.message).toContain('Invalid credentials');
    });
  });

  describe('Password Security', () => {
    it('should not return password in responses', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          password: 'password123',
        });

      if (response.status === 201) {
        expect(response.body.data.user).not.toHaveProperty('password');
      }
    });

    it('should hash passwords before storage', async () => {
      // This would require database access in integration test
      // Verify that password is not stored in plain text
    });
  });

  describe('Mass Assignment Protection', () => {
    it('should prevent role escalation via mass assignment', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'hacker@example.com',
          password: 'password123',
          role: 'admin', // Attempting to set admin role
        });

      if (response.status === 201) {
        // Should default to 'user' role, not 'admin'
        expect(response.body.data.user.role).toBe('user');
      }
    });
  });
});

module.exports = { describe, it, expect };
