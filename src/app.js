const express = require('express');
const path = require('path');
const cors = require('cors');

require('dotenv').config();

// =========================
// ROUTES
// =========================

const productoRoutes =
  require('./routes/producto.routes');

const authRoutes =
  require('./auth/auth.routes');

const adminRoutes =
  require('./admin/admin.routes');

const saleRoutes =
  require('./sales/sale.routes');

// =========================
// APP
// =========================

const app = express();

// =========================
// MIDDLEWARES
// =========================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended:false
  })
);

// =========================
// API ROUTES
// =========================

console.log(
  'Mounting /api/productos'
);

app.use(
  '/api/productos',
  productoRoutes
);

console.log(
  'Mounting /api/auth'
);

app.use(
  '/api/auth',
  authRoutes
);

console.log(
  'Mounting /api/admin'
);

app.use(
  '/api/admin',
  adminRoutes
);

console.log(
  'Mounting /api/sales'
);

app.use(
  '/api/sales',
  saleRoutes
);

// =========================
// TEST
// =========================

app.get(
  '/test',
  (req,res) => {

    res.send(
      'Servidor funcionando correctamente'
    );

  }
);

// =========================
// DB STATUS
// =========================

app.get(
  '/db-status',
  async (req,res) => {

    try {

      const pool =
        require('./config/db');

      const [rows] =
        await pool.query(
          'SELECT 1 AS ok'
        );

      res.json({
        db:'ok',
        result:rows
      });

    } catch(err){

      console.error(
        'DB ERROR:',
        err
      );

      res.status(500).json({
        db:'error',
        message:err.message
      });

    }

  }
);

// =========================
// FRONTEND
// =========================

const staticPath =
  path.join(
    __dirname,
    'public'
  );

console.log(
  'Serving static files from:',
  staticPath
);

app.use(
  express.static(staticPath)
);

// =========================
// FALLBACK
// =========================

app.get('*', (req,res) => {

  if(
    req.path.startsWith('/api')
  ){

    return res.status(404).json({
      message:'Not Found'
    });

  }

  res.sendFile(
    path.join(
      staticPath,
      'index.html'
    )
  );

});

// =========================
// ERROR HANDLER
// =========================

app.use(
  (err,req,res,next) => {

    console.error(
      '🔥 ERROR:',
      err
    );

    res.status(500).json({
      message:
        'Internal Server Error',

      error:
        err.message,

      stack:
        err.stack
    });

  }
);

module.exports = app;
