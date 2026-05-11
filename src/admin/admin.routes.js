const express = require('express');

const router = express.Router();

const {
  verifyToken,
  verifyAdmin
} = require('../auth/auth.middleware');

// =========================
// PRIVATE ADMIN ROUTE
// =========================

router.get(
  '/dashboard',
  verifyToken,
  verifyAdmin,
  (req, res) => {

    res.json({
      message: 'Bienvenido administrador',
      user: req.user
    });

  }
);

module.exports = router;