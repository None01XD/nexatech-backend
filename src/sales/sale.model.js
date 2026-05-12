const pool = require('../config/db');

const Sale = {

  // =========================
  // CREATE SALE
  // =========================

  async create(cart){

    const conn =
      await pool.getConnection();

    try {

      await conn.beginTransaction();

      // =========================
      // TOTAL
      // =========================

      let total = 0;

      for(const item of cart){

        total +=
          Number(item.precio) *
          item.qty;

      }

      // =========================
      // INSERT SALE
      // =========================

      const [saleResult] =
        await conn.query(
          `
          INSERT INTO ventas
          (total)
          VALUES (?)
          `,
          [total]
        );

      const ventaId =
        saleResult.insertId;

      // =========================
      // ITEMS
      // =========================

      for(const item of cart){

        const subtotal =
          Number(item.precio) *
          item.qty;

        // guardar item
        await conn.query(
          `
          INSERT INTO venta_items
          (
            venta_id,
            producto_id,
            nombre,
            precio,
            cantidad,
            subtotal
          )
          VALUES (?, ?, ?, ?, ?, ?)
          `,
          [
            ventaId,
            item.id,
            item.nombre,
            item.precio,
            item.qty,
            subtotal
          ]
        );

        // =========================
        // UPDATE STOCK
        // =========================

        await conn.query(
          `
          UPDATE productos
          SET cantidad =
            cantidad - ?
          WHERE id = ?
          `,
          [
            item.qty,
            item.id
          ]
        );

        // =========================
        // UPDATE STATUS
        // =========================

        await conn.query(
          `
          UPDATE productos
          SET status =
            CASE
              WHEN cantidad <= 0
              THEN 'agotado'
              ELSE 'disponible'
            END
          WHERE id = ?
          `,
          [item.id]
        );

      }

      await conn.commit();

      return {
        ok:true,
        ventaId,
        total
      };

    } catch(err){

      await conn.rollback();

      throw err;

    } finally {

      conn.release();

    }

  }

};

module.exports = Sale;