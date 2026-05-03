-- Crear base de datos y tabla productos
CREATE DATABASE IF NOT EXISTS productos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE productos_db;

CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  precio DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  cantidad INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ejemplos
INSERT INTO productos (nombre, precio, cantidad) VALUES
('Producto A', 19.99, 10),
('Producto B', 49.50, 5);
