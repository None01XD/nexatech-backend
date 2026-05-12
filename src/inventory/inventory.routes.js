const express =
  require('express');

const router =
  express.Router();

const pool =
  require('../config/db');

const Inventory =
  require('./inventory.model');

const {
  verifyToken,
  verifyAdmin
} = require('../auth/auth.middleware');

// =========================
// RESTOCK
// =========================

router.post(
  '/restock/:id',

  verifyToken,
  verifyAdmin,

  async (req,res,next) => {

    try {

      const id =
        req.params.id;

      const amount =
        Number(req.body.amount);

      if(
        !amount ||
        amount <= 0
      ){

        return res.status(400).json({
          message:'Cantidad inválida'
        });

      }

      // =========================
      // CURRENT STOCK
      // =========================

      const [rows] =
        await pool.query(
          `
          SELECT *
          FROM productos
          WHERE id = ?
          `,
          [id]
        );

      if(!rows.length){

        return res.status(404).json({
          message:'Producto no encontrado'
        });

      }

      const product =
        rows[0];

      const oldStock =
        product.cantidad;

      const newStock =
        oldStock + amount;

      // =========================
      // UPDATE PRODUCT
      // =========================

      await pool.query(
        `
        UPDATE productos
        SET
          cantidad = ?,
          status =
            CASE
              WHEN ? <= 0
              THEN 'agotado'
              ELSE 'disponible'
            END
        WHERE id = ?
        `,
        [
          newStock,
          newStock,
          id
        ]
      );

      // =========================
      // LOG INVENTORY
      // =========================

      await Inventory.log({

        producto_id:id,

        action:'restock',

        old_stock:oldStock,

        new_stock:newStock

      });

      res.json({

        message:'Stock actualizado',

        oldStock,
        newStock

      });

    } catch(err){

      next(err);

    }

  }
);

module.exports = router;