const { Pool } = require('pg');

/**
 * Database Pool Manager
 * Gerencia pools de conexões com PostgreSQL de forma centralizada
 * Evita duplicação de código nos repositories
 */
class DatabasePoolManager {
  constructor() {
    this.pools = new Map();
  }

  /**
   * Creates or returns an existing pool for a database
   * @param {String} dbName - Database name identifier
   * @param {Object} config - Database configuration
   * @returns {Pool} PostgreSQL Pool instance
   */
  getPool(dbName, config = {}) {
    if (this.pools.has(dbName)) {
      return this.pools.get(dbName);
    }

    const poolConfig = {
      host: config.host || process.env.DB_HOST || 'localhost',
      port: config.port || process.env.DB_PORT || 5432,
      database: config.database || process.env.DB_NAME,
      user: config.user || process.env.DB_USER,
      password: config.password || process.env.DB_PASSWORD,
      max: config.max || 20, // Maximum pool size
      idleTimeoutMillis: config.idleTimeout || 30000,
      connectionTimeoutMillis: config.connectionTimeout || 2000,
    };

    // Validate required config
    if (!poolConfig.database || !poolConfig.user) {
      throw new Error('Database name and user are required');
    }

    const pool = new Pool(poolConfig);

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });

    this.pools.set(dbName, pool);
    return pool;
  }

  /**
   * Execute a query with parameterized values (prevents SQL injection)
   * @param {Pool} pool - Database pool
   * @param {String} query - SQL query
   * @param {Array} values - Query parameters
   * @returns {Promise} Query result
   */
  async executeQuery(pool, query, values = []) {
    const client = await pool.connect();
    try {
      return await client.query(query, values);
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Execute a transaction with multiple queries
   * @param {Pool} pool - Database pool
   * @param {Function} callback - Transaction callback function
   * @returns {Promise} Transaction result
   */
  async executeTransaction(pool, callback) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Transaction error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Close a specific pool or all pools
   * @param {String|null} dbName - Database name or null for all
   */
  async closePool(dbName = null) {
    if (dbName) {
      const pool = this.pools.get(dbName);
      if (pool) {
        await pool.end();
        this.pools.delete(dbName);
      }
    } else {
      // Close all pools
      for (const [name, pool] of this.pools) {
        await pool.end();
        this.pools.delete(name);
      }
    }
  }

  /**
   * Check if pool is healthy
   * @param {Pool} pool - Database pool
   * @returns {Promise<Boolean>} Health status
   */
  async checkHealth(pool) {
    try {
      await pool.query('SELECT 1');
      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

module.exports = new DatabasePoolManager();
