const express = require('express');
const path = require('path');
const productoRoutes = require('./routes/producto.routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API routes
console.log('Mounting /api/productos');
app.use('/api/productos', productoRoutes);

// Test route to verify server is running
app.get('/test', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// DB status route (simple)
app.get('/db-status', async (req, res) => {
  try {
    const pool = require('./config/db');
    const [rows] = await pool.query('SELECT 1 AS ok');
    return res.json({ db: 'ok', result: rows });
  } catch (err) {
    console.error('DB status error:', err.message);
    return res.status(500).json({ db: 'error', message: err.message });
  }
});

// Serve static frontend (public is inside src)
const staticPath = path.join(__dirname, 'public');
console.log('Serving static files from:', staticPath);
app.use(express.static(staticPath));

// Fallback for SPA pages - only for non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/db-status') || req.path.startsWith('/test')) {
    return res.status(404).json({ message: 'Not Found' });
  }
  res.sendFile(path.join(staticPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
