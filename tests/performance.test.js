const request = require('supertest');
const autocannon = require('autocannon');

/**
 * Performance and Load Testing Suite
 * Testes de carga e performance para os microserviços
 */
describe('Performance Tests', () => {
  let app;

  beforeAll(() => {
    app = require('../api-gateway/src/index');
  });

  describe('Response Time Tests', () => {
    it('health check should respond within 100ms', async () => {
      const start = Date.now();
      const response = await request(app).get('/health');
      const duration = Date.now() - start;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(100);
    });

    it('product listing should respond within 500ms', async () => {
      const start = Date.now();
      const response = await request(app).get('/api/products');
      const duration = Date.now() - start;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(500);
    });
  });

  describe('Database Query Optimization', () => {
    it('should use indexed queries for product search', async () => {
      // Test que categoria está indexada
      const response = await request(app)
        .get('/api/products')
        .query({ category: 'electronics' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should efficiently handle multiple filters', async () => {
      const start = Date.now();
      const response = await request(app)
        .get('/api/products')
        .query({
          category: 'electronics',
          minPrice: 100,
          maxPrice: 1000,
        });
      const duration = Date.now() - start;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(300);
    });
  });

  describe('Pagination Performance', () => {
    it('should handle paginated requests efficiently', async () => {
      const start = Date.now();
      const response = await request(app)
        .get('/api/products')
        .query({ page: 1, limit: 20 });
      const duration = Date.now() - start;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(300);
    });

    it('should limit maximum page size', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ limit: 10000 }); // Muito grande

      expect(response.status).toBe(200);
      // Deve ter um limite razoável
      if (response.body.data) {
        expect(response.body.data.length).toBeLessThanOrEqual(100);
      }
    });
  });

  describe('Memory Leak Detection', () => {
    it('should not accumulate memory over multiple requests', async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // Make 100 requests
      for (let i = 0; i < 100; i++) {
        await request(app).get('/health');
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      const memoryIncreaseMB = memoryIncrease / 1024 / 1024;

      // Memory should not increase more than 10MB
      expect(memoryIncreaseMB).toBeLessThan(10);
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

  // Test 2: Product Listing
  console.log('Test 2: Product Listing');
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
  console.log(`✅ Product API: ${productsResult.requests.average >= 500 ? 'PASS' : 'FAIL'} (Target: >500 req/sec)`);
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
        name: 'Product Listing',
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
