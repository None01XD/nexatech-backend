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

// DB status
app.get('/db-status', async (req, res) => {
  try {
    const pool = require('./config/db');
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ db: 'ok', result: rows });
  } catch (err) {
    res.status(500).json({ db: 'error', message: err.message });
  }
});

// Frontend (MUY IMPORTANTE)
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

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
