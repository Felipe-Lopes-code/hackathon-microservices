const { Pool } = require('pg');
const Product = require('../../domain/entities/Product');
const IProductRepository = require('../../domain/repositories/IProductRepository');

// Infrastructure - PostgreSQL Repository Implementation
class PostgresProductRepository extends IProductRepository {
  constructor() {
    super();
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
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        stock INTEGER DEFAULT 0,
        category VARCHAR(100),
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
      CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
    `;

    try {
      await this.pool.query(createTableQuery);
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  async createProduct(productData) {
    const query = `
      INSERT INTO products (name, description, price, stock, category, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      productData.name,
      productData.description,
      productData.price,
      productData.stock || 0,
      productData.category,
      productData.imageUrl,
    ];

    const result = await this.pool.query(query, values);
    return this._mapToEntity(result.rows[0]);
  }

  async findProductById(id) {
    const query = 'SELECT * FROM products WHERE id = $1';
    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this._mapToEntity(result.rows[0]);
  }

  async findAllProducts(filters = {}) {
    let query = 'SELECT * FROM products WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.category) {
      query += ` AND category = $${paramCount}`;
      values.push(filters.category);
      paramCount++;
    }

    if (filters.minPrice) {
      query += ` AND price >= $${paramCount}`;
      values.push(filters.minPrice);
      paramCount++;
    }

    if (filters.maxPrice) {
      query += ` AND price <= $${paramCount}`;
      values.push(filters.maxPrice);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    if (filters.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
      paramCount++;
    }

    const result = await this.pool.query(query, values);
    return result.rows.map((row) => this._mapToEntity(row));
  }

  async updateProduct(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount}`);
      values.push(data.name);
      paramCount++;
    }

    if (data.description !== undefined) {
      fields.push(`description = $${paramCount}`);
      values.push(data.description);
      paramCount++;
    }

    if (data.price !== undefined) {
      fields.push(`price = $${paramCount}`);
      values.push(data.price);
      paramCount++;
    }

    if (data.stock !== undefined) {
      fields.push(`stock = $${paramCount}`);
      values.push(data.stock);
      paramCount++;
    }

    if (data.category !== undefined) {
      fields.push(`category = $${paramCount}`);
      values.push(data.category);
      paramCount++;
    }

    if (data.imageUrl !== undefined) {
      fields.push(`image_url = $${paramCount}`);
      values.push(data.imageUrl);
      paramCount++;
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    values.push(id);

    const query = `
      UPDATE products 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await this.pool.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    return this._mapToEntity(result.rows[0]);
  }

  async deleteProduct(id) {
    const query = 'DELETE FROM products WHERE id = $1 RETURNING id';
    const result = await this.pool.query(query, [id]);
    return result.rows.length > 0;
  }

  async updateStock(id, quantity) {
    const query = `
      UPDATE products 
      SET stock = stock + $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

    const result = await this.pool.query(query, [quantity, id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this._mapToEntity(result.rows[0]);
  }

  _mapToEntity(row) {
    return new Product({
      id: row.id,
      name: row.name,
      description: row.description,
      price: parseFloat(row.price),
      stock: row.stock,
      category: row.category,
      imageUrl: row.image_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}

module.exports = PostgresProductRepository;
