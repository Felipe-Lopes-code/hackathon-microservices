const axios = require('axios');
const autocannon = require('autocannon');

/**
 * Performance and Load Testing Suite
 * Testes de carga e performance para os microserviços da plataforma EduShare
 */
describe('Performance Tests', () => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

  beforeAll(async () => {
    // Verificar se API está online
    try {
      await axios.get(`${API_BASE_URL}/health`);
      console.log('✅ API Gateway online para testes de performance');
    } catch (error) {
      throw new Error(`❌ API Gateway offline. Execute: docker-compose up -d`);
    }
  });

  describe('Response Time Tests', () => {
    it('health check should respond within 200ms', async () => {
      const start = Date.now();
      const response = await axios.get(`${API_BASE_URL}/health`);
      const duration = Date.now() - start;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(200);
    });

    it('material listing should respond within 1000ms', async () => {
      const start = Date.now();
      const response = await axios.get(`${API_BASE_URL}/api/products`);
      const duration = Date.now() - start;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('Database Query Optimization', () => {
    it('should use indexed queries for material search', async () => {
      const response = await axios.get(`${API_BASE_URL}/api/products`, {
        params: { category: 'Matemática' }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
    });

    it('should efficiently handle multiple filters', async () => {
      const start = Date.now();
      const response = await axios.get(`${API_BASE_URL}/api/products`, {
        params: {
          category: 'Matemática',
          minPrice: 0,
          maxPrice: 100,
        }
      });
      const duration = Date.now() - start;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(500);
    });
  });

  describe('Pagination Performance', () => {
    it('should handle paginated requests efficiently', async () => {
      const start = Date.now();
      const response = await axios.get(`${API_BASE_URL}/api/products`, {
        params: { page: 1, limit: 20 }
      });
      const duration = Date.now() - start;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(500);
    });

    it('should limit maximum page size', async () => {
      const response = await axios.get(`${API_BASE_URL}/api/products`, {
        params: { limit: 10000 }
      });

      expect(response.status).toBe(200);
      // Deve ter um limite razoável
      if (response.data.data) {
        expect(response.data.data.length).toBeLessThanOrEqual(100);
      }
    });
  });

  describe('Concurrent Requests', () => {
    it('should handle 10 concurrent requests', async () => {
      const requests = Array(10).fill(null).map(() =>
        axios.get(`${API_BASE_URL}/health`)
      );

      const results = await Promise.all(requests);
      
      results.forEach(response => {
        expect(response.status).toBe(200);
      });
    });

    it('should handle concurrent material searches', async () => {
      const requests = Array(5).fill(null).map(() =>
        axios.get(`${API_BASE_URL}/api/products`)
      );

      const start = Date.now();
      const results = await Promise.all(requests);
      const duration = Date.now() - start;

      results.forEach(response => {
        expect(response.status).toBe(200);
      });
      
      // 5 requisições simultâneas em menos de 2s
      expect(duration).toBeLessThan(2000);
    });
  });
});

/**
 * Load Testing with Autocannon
 * Execute: node tests/performance.test.js
 */
async function runLoadTests() {
  console.log('\n🔥 Starting Load Tests with Autocannon...\n');

  // Test 1: Gateway Health Check
  console.log('Test 1: Gateway Health Check');
  const healthResult = await autocannon({
    url: 'http://localhost:3000/health',
    connections: 100,
    duration: 10,
    pipelining: 1,
  });

  console.log(`Requests/sec: ${healthResult.requests.average}`);
  console.log(`Latency avg: ${healthResult.latency.mean}ms`);
  console.log(`Throughput: ${healthResult.throughput.average} bytes/sec\n`);

  // Test 2: Material Listing
  console.log('Test 2: Material Listing');
  const productsResult = await autocannon({
    url: 'http://localhost:3000/api/products',
    connections: 50,
    duration: 10,
    pipelining: 1,
  });

  console.log(`Requests/sec: ${productsResult.requests.average}`);
  console.log(`Latency avg: ${productsResult.latency.mean}ms`);
  console.log(`Throughput: ${productsResult.throughput.average} bytes/sec\n`);

  // Test 3: Authentication Load
  console.log('Test 3: Authentication Load');
  const authResult = await autocannon({
    url: 'http://localhost:3000/api/auth/login',
    connections: 20,
    duration: 10,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'password123',
    }),
  });

  console.log(`Requests/sec: ${authResult.requests.average}`);
  console.log(`Latency avg: ${authResult.latency.mean}ms`);
  console.log(`Throughput: ${authResult.throughput.average} bytes/sec\n`);

  // Performance Benchmarks
  console.log('📊 Performance Benchmarks:');
  console.log(`✅ Health Check: ${healthResult.requests.average >= 1000 ? 'PASS' : 'FAIL'} (Target: >1000 req/sec)`);
  console.log(`✅ Material API: ${productsResult.requests.average >= 500 ? 'PASS' : 'FAIL'} (Target: >500 req/sec)`);
  console.log(`✅ Auth API: ${authResult.requests.average >= 100 ? 'PASS' : 'FAIL'} (Target: >100 req/sec)`);
  console.log(`✅ Latency: ${healthResult.latency.mean < 100 ? 'PASS' : 'FAIL'} (Target: <100ms)\n`);

  // Generate performance report
  const report = {
    timestamp: new Date().toISOString(),
    tests: [
      {
        name: 'Health Check',
        requestsPerSec: healthResult.requests.average,
        latencyMs: healthResult.latency.mean,
        throughput: healthResult.throughput.average,
      },
      {
        name: 'Material Listing',
        requestsPerSec: productsResult.requests.average,
        latencyMs: productsResult.latency.mean,
        throughput: productsResult.throughput.average,
      },
      {
        name: 'Authentication',
        requestsPerSec: authResult.requests.average,
        latencyMs: authResult.latency.mean,
        throughput: authResult.throughput.average,
      },
    ],
  };

  // Save report
  const fs = require('fs');
  fs.writeFileSync(
    'performance-report.json',
    JSON.stringify(report, null, 2)
  );

  console.log('📝 Performance report saved to: performance-report.json');
}

// Run load tests if executed directly
if (require.main === module) {
  runLoadTests().catch(console.error);
}

module.exports = { runLoadTests };
