const express =
  require('express');

const router =
  express.Router();

const pool =
  require('../config/db');

const {
  verifyToken,
  verifyAdmin
} = require('../auth/auth.middleware');

// =========================
// STATS
// =========================

router.get(
  '/stats',

  verifyToken,
  verifyAdmin,

  async (req,res,next) => {

    try {

      // total ventas
      const [salesRows] =
        await pool.query(`
          SELECT
            COUNT(*) AS totalSales,
            COALESCE(
              SUM(total),
              0
            ) AS revenue
          FROM ventas
        `);

      // productos
      const [productRows] =
        await pool.query(`
          SELECT
            COUNT(*) AS totalProducts
          FROM productos
        `);

      // agotados
      const [outRows] =
        await pool.query(`
          SELECT
            COUNT(*) AS outOfStock
          FROM productos
          WHERE status = 'agotado'
        `);

      res.json({

        totalSales:
          salesRows[0].totalSales,

        revenue:
          salesRows[0].revenue,

        totalProducts:
          productRows[0].totalProducts,

        outOfStock:
          outRows[0].outOfStock

      });

    } catch(err){

      next(err);

    }

  }
);

module.exports = router;