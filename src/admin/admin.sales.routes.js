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
// SALES HISTORY
// =========================

router.get(
  '/sales',

  verifyToken,
  verifyAdmin,

  async (req,res,next) => {

    try {

      const [rows] =
        await pool.query(`
          SELECT
            id,
            total,
            created_at
          FROM ventas
          ORDER BY id DESC
        `);

      res.json(rows);

    } catch(err){

      next(err);

    }

  }
);

module.exports = router;