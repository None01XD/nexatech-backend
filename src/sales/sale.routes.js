const express =
  require('express');

const router =
  express.Router();

const controller =
  require('./sale.controller');

router.post(
  '/checkout',
  controller.checkout
);

module.exports = router;