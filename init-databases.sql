-- Initialize databases for each microservice

-- Create databases
CREATE DATABASE auth_db;
CREATE DATABASE product_db;
CREATE DATABASE order_db;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE auth_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE product_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE order_db TO postgres;
