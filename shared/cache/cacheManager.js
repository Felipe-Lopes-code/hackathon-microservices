const Redis = require('ioredis');

/**
 * Cache Manager with Redis
 * Implementa estratégia de cache para otimização de performance
 */
class CacheManager {
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.redis.on('error', (err) => {
      console.error('Redis error:', err);
    });

    this.redis.on('connect', () => {
      console.log('Redis connected successfully');
    });

    // Default TTL (Time To Live) em segundos
    this.defaultTTL = 3600; // 1 hour
  }

  /**
   * Get value from cache
   * @param {String} key - Cache key
   * @returns {Promise<any>} Cached value or null
   */
  async get(key) {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set value in cache
   * @param {String} key - Cache key
   * @param {any} value - Value to cache
   * @param {Number} ttl - Time to live in seconds
   * @returns {Promise<Boolean>} Success status
   */
  async set(key, value, ttl = this.defaultTTL) {
    try {
      const serialized = JSON.stringify(value);
      await this.redis.setex(key, ttl, serialized);
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  /**
   * Delete key from cache
   * @param {String} key - Cache key
   * @returns {Promise<Boolean>} Success status
   */
  async del(key) {
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  /**
   * Delete multiple keys matching a pattern
   * @param {String} pattern - Key pattern (e.g., 'products:*')
   * @returns {Promise<Number>} Number of keys deleted
   */
  async delPattern(pattern) {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length === 0) return 0;
      
      await this.redis.del(...keys);
      return keys.length;
    } catch (error) {
      console.error('Cache delete pattern error:', error);
      return 0;
    }
  }

  /**
   * Check if key exists
   * @param {String} key - Cache key
   * @returns {Promise<Boolean>} Exists status
   */
  async exists(key) {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  /**
   * Get or set cache (cache-aside pattern)
   * @param {String} key - Cache key
   * @param {Function} fetchFunction - Function to fetch data if not cached
   * @param {Number} ttl - Time to live
   * @returns {Promise<any>} Cached or fetched value
   */
  async getOrSet(key, fetchFunction, ttl = this.defaultTTL) {
    // Try to get from cache
    const cached = await this.get(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch and cache
    try {
      const data = await fetchFunction();
      await this.set(key, data, ttl);
      return data;
    } catch (error) {
      console.error('Cache getOrSet error:', error);
      throw error;
    }
  }

  /**
   * Increment counter
   * @param {String} key - Cache key
   * @param {Number} amount - Amount to increment
   * @returns {Promise<Number>} New value
   */
  async incr(key, amount = 1) {
    try {
      return await this.redis.incrby(key, amount);
    } catch (error) {
      console.error('Cache increment error:', error);
      return 0;
    }
  }

  /**
   * Set expiration time for a key
   * @param {String} key - Cache key
   * @param {Number} seconds - Seconds until expiration
   * @returns {Promise<Boolean>} Success status
   */
  async expire(key, seconds) {
    try {
      await this.redis.expire(key, seconds);
      return true;
    } catch (error) {
      console.error('Cache expire error:', error);
      return false;
    }
  }

  /**
   * Get remaining TTL for a key
   * @param {String} key - Cache key
   * @returns {Promise<Number>} TTL in seconds (-1 if no expiry, -2 if key doesn't exist)
   */
  async ttl(key) {
    try {
      return await this.redis.ttl(key);
    } catch (error) {
      console.error('Cache TTL error:', error);
      return -2;
    }
  }

  /**
   * Flush all cache
   * @returns {Promise<Boolean>} Success status
   */
  async flushAll() {
    try {
      await this.redis.flushall();
      return true;
    } catch (error) {
      console.error('Cache flush error:', error);
      return false;
    }
  }

  /**
   * Close Redis connection
   */
  async close() {
    await this.redis.quit();
  }

  /**
   * Health check
   * @returns {Promise<Boolean>} Health status
   */
  async isHealthy() {
    try {
      await this.redis.ping();
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Cache key generators
const CacheKeys = {
  product: (id) => `product:${id}`,
  products: (filters) => `products:${JSON.stringify(filters)}`,
  user: (id) => `user:${id}`,
  order: (id) => `order:${id}`,
  orders: (userId) => `orders:user:${userId}`,
};

module.exports = { CacheManager: new CacheManager(), CacheKeys };
