-- Initialize databases for EduShare microservices

-- Create databases
CREATE DATABASE auth_db;
CREATE DATABASE material_db;
CREATE DATABASE share_db;

-- Legacy aliases for backward compatibility
CREATE DATABASE product_db;
CREATE DATABASE order_db;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE auth_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE material_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE share_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE product_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE order_db TO postgres;
