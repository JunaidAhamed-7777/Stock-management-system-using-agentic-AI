-- StockFlow local development database bootstrap
-- Run as PostgreSQL superuser (postgres) on port 5432 (PostgreSQL 18)

ALTER USER postgres WITH PASSWORD 'StockFlow_Dev2026';

SELECT 'CREATE DATABASE stock_management'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'stock_management')\gexec
