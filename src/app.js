const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const productoRoutes = require('./routes/producto.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API
console.log('Mounting /api/productos');
app.use('/api/productos', productoRoutes);

// Test
app.get('/test', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// DB status (muy útil para probar conexión)
app.get('/db-status', async (req, res) => {
  try {
    const pool = require('./config/db');
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ db: 'ok', result: rows });
  } catch (err) {
    console.error('DB ERROR:', err);
    res.status(500).json({ db: 'error', message: err.message });
  }
});

// Frontend
const staticPath = path.join(__dirname, 'public');
console.log('Serving static files from:', staticPath);
app.use(express.static(staticPath));

// Fallback
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'Not Found' });
  }
  res.sendFile(path.join(staticPath, 'index.html'));
});

// 🔥 ERROR HANDLER MEJORADO (CLAVE)
app.use((err, req, res, next) => {
  console.error('🔥 ERROR REAL COMPLETO:', err);

  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message,
    stack: err.stack // opcional, pero útil para debug
  });
});

module.exports = app;
