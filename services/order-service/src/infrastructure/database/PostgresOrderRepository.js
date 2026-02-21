const { Pool } = require('pg');
const Order = require('../../domain/entities/Order');

class PostgresOrderRepository {
  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    this._initializeDatabase();
  }

  async _initializeDatabase() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        items JSONB NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    `;

    try {
      await this.pool.query(createTableQuery);
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  async createOrder(orderData) {
    const query = `
      INSERT INTO orders (user_id, items, total_amount, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [
      orderData.userId,
      JSON.stringify(orderData.items),
      orderData.totalAmount,
      orderData.status,
    ];

    const result = await this.pool.query(query, values);
    return this._mapToEntity(result.rows[0]);
  }

  async findOrderById(id) {
    const query = 'SELECT * FROM orders WHERE id = $1';
    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this._mapToEntity(result.rows[0]);
  }

  async findOrdersByUserId(userId) {
    const query = 'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await this.pool.query(query, [userId]);
    return result.rows.map((row) => this._mapToEntity(row));
  }

  async updateOrderStatus(id, status) {
    const query = `
      UPDATE orders 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

    const result = await this.pool.query(query, [status, id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this._mapToEntity(result.rows[0]);
  }

  _mapToEntity(row) {
    return new Order({
      id: row.id,
      userId: row.user_id,
      items: row.items,
      totalAmount: parseFloat(row.total_amount),
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}

module.exports = PostgresOrderRepository;
