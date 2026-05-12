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
// LOGS
// =========================

router.get(
  '/logs',

  verifyToken,
  verifyAdmin,

  async (req,res,next) => {

    try {

      const [rows] =
        await pool.query(`
          SELECT *
          FROM logs
          ORDER BY id DESC
        `);

      res.json(rows);

    } catch(err){

      next(err);

    }

  }
);

module.exports = router;