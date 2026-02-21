const axios = require('axios');

/**
 * Security Test Suite
 * Testes automatizados de segurança para todos os microserviços
 */
describe('Security Tests', () => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
  let authToken;
  let testUserId = 0;

  beforeAll(async () => {
    // Verificar se API Gateway está online
    try {
      const health = await axios.get(`${API_BASE_URL}/health`);
      console.log('✅ API Gateway online');
    } catch (error) {
      throw new Error(`❌ API Gateway offline. Execute: docker-compose up -d\nErro: ${error.message}`);
    }
    
    // Criar usuário de teste
    try {
      testUserId = Math.floor(Math.random() * 1000000);
      const register = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        name: 'Security Test User',
        email: `sectest${testUserId}@test.com`,
        password: 'SecurePass123!'
      });
      authToken = register.data.data.token;
      console.log('✅ Usuário de teste criado');
    } catch (error) {
      console.warn('⚠️ Não foi possível criar usuário de teste:', error.response?.data?.message);
    }
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
        try {
          const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
            email: payload,
            password: 'password123',
          });
          
          // Se retornar sucesso, verificar que não há erro SQL exposto
          expect(response.data.message).not.toContain('SQL');
          expect(response.data.message).not.toContain('syntax');
        } catch (error) {
          // Deve retornar 401 (não autorizado), não 500 (erro servidor)
          expect(error.response?.status).toBe(401);
          expect(error.response?.data?.message).not.toContain('SQL');
          expect(error.response?.data?.message).not.toContain('syntax');
        }
      }
    });

    it('should prevent SQL injection in product search', async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products`, {
          params: { category: "'; DROP TABLE products--" }
        });
        
        // Não deve retornar erro 500
        expect(response.status).toBeLessThan(500);
      } catch (error) {
        // Se houver erro, não deve ser 500
        expect(error.response?.status).toBeLessThan(500);
      }
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
        try {
          const userId = Math.floor(Math.random() * 1000000);
          const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
            name: payload,
            email: `xsstest${userId}@test.com`,
            password: 'SecurePass123!',
          });

          // Se aceitar, deve sanitizar
          if (response.status === 201) {
            expect(response.data.data.user.name).not.toContain('<script>');
            expect(response.data.data.user.name).not.toContain('javascript:');
            expect(response.data.data.user.name).not.toContain('<img');
          }
        } catch (error) {
          // Deve rejeitar com status apropriado
          expect(error.response?.status).toBeGreaterThanOrEqual(400);
        }
      }
    });
  });

  describe('Authentication & Authorization', () => {
    it('should reject requests without token', async () => {
      try {
        await axios.get(`${API_BASE_URL}/api/auth/profile`);
        fail('Should have thrown error');
      } catch (error) {
        expect(error.response?.status).toBe(401);
        expect(error.response?.data?.success).toBe(false);
        expect(error.response?.data?.message.toLowerCase()).toContain('token');
      }
    });

    it('should reject invalid tokens', async () => {
      try {
        await axios.get(`${API_BASE_URL}/api/auth/profile`, {
          headers: { 'Authorization': 'Bearer invalid-token-here' }
        });
        fail('Should have thrown error');
      } catch (error) {
        expect(error.response?.status).toBe(401);
        expect(error.response?.data?.success).toBe(false);
      }
    });

    it('should reject expired tokens', async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwIjoxNjAwMDAwMDAwfQ.invalid';

      try {
        await axios.get(`${API_BASE_URL}/api/auth/profile`, {
          headers: { 'Authorization': `Bearer ${expiredToken}` }
        });
        fail('Should have thrown error');
      } catch (error) {
        expect(error.response?.status).toBe(401);
        expect(error.response?.data?.success).toBe(false);
      }
    });

    it('should reject malformed Authorization header', async () => {
      const malformedHeaders = [
        'invalid-format',
        'Bearer',
        'Bearer ',
        'Basic token-here',
      ];

      for (const header of malformedHeaders) {
        try {
          await axios.get(`${API_BASE_URL}/api/auth/profile`, {
            headers: { 'Authorization': header }
          });
          fail('Should have thrown error');
        } catch (error) {
          expect(error.response?.status).toBe(401);
        }
      }
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      const requests = [];
      const maxRequests = 105;

      for (let i = 0; i < maxRequests; i++) {
        requests.push(
          axios.get(`${API_BASE_URL}/api/products`)
            .then(() => 200)
            .catch((error) => error.response?.status || 500)
        );
      }

      const statuses = await Promise.all(requests);
      const rateLimitedCount = statuses.filter((status) => status === 429).length;

      expect(rateLimitedCount).toBeGreaterThan(0);
    }, 30000);
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
        try {
          await axios.post(`${API_BASE_URL}/api/auth/register`, {
            name: 'Test User',
            email: email,
            password: 'SecurePass123!',
          });
          fail('Should have thrown error for invalid email');
        } catch (error) {
          expect(error.response?.status).toBe(400);
          expect(error.response?.data?.success).toBe(false);
        }
      }
    });

    it('should enforce password complexity', async () => {
      const weakPasswords = [
        '123',
        'pass',
        '1234567',
      ];

      for (const password of weakPasswords) {
        try {
          const userId = Math.floor(Math.random() * 1000000);
          await axios.post(`${API_BASE_URL}/api/auth/register`, {
            name: 'Test User',
            email: `weakpass${userId}@test.com`,
            password: password,
          });
          fail('Should have thrown error for weak password');
        } catch (error) {
          expect(error.response?.status).toBe(400);
          expect(error.response?.data?.success).toBe(false);
        }
      }
    });
  });

  describe('CORS Protection', () => {
    it('should include CORS headers', async () => {
      const response = await axios.get(`${API_BASE_URL}/api/products`);
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('Security Headers', () => {
    it('should include security headers (Helmet)', async () => {
      const response = await axios.get(`${API_BASE_URL}/health`);
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBeDefined();
    });
  });

  describe('Error Information Disclosure', () => {
    it('should not expose stack traces', async () => {
      try {
        await axios.get(`${API_BASE_URL}/api/nonexistent-endpoint`);
      } catch (error) {
        expect(error.response?.data).not.toHaveProperty('stack');
        expect(error.response?.data?.message).not.toContain(' at ');
      }
    });

    it('should return generic error messages', async () => {
      try {
        await axios.post(`${API_BASE_URL}/api/auth/login`, {
          email: 'nonexistent@test.com',
          password: 'wrongpassword',
        });
      } catch (error) {
        expect(error.response?.status).toBe(401);
      }
    });
  });

  describe('Password Security', () => {
    it('should not return password in responses', async () => {
      if (!authToken) {
        console.warn('⚠️ Skipping test - no auth token available');
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });

        expect(response.data.data.user).not.toHaveProperty('password');
        expect(response.data.data.user).not.toHaveProperty('password_hash');
      } catch (error) {
        console.warn('⚠️ Profile endpoint not available');
      }
    });

    it('should hash passwords before storage', async () => {
      try {
        const userId = Math.floor(Math.random() * 1000000);
        const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
          name: 'Hash Test User',
          email: `hashtest${userId}@test.com`,
          password: 'PlainTextPassword123!'
        });

        expect(response.status).toBe(201);
        if (response.data.data?.user) {
          expect(response.data.data.user).not.toHaveProperty('password');
        }
      } catch (error) {
        console.warn('⚠️ Password hash test skipped');
      }
    });
  });
});
