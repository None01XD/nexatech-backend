const Inventory =
  require('../inventory/inventory.model');
const Log =
  require('../logs/log.model');
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

        // stock actual
const [stockRows] =
  await conn.query(
    `
    SELECT cantidad
    FROM productos
    WHERE id = ?
    `,
    [item.id]
  );

const oldStock =
  stockRows[0].cantidad;

const newStock =
  oldStock - item.qty;

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

        await Inventory.log({

  producto_id:
    item.id,

  action:
    'checkout',

  old_stock:
    oldStock,

  new_stock:
    newStock

});

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
      await Log.create(

  'Nueva venta',

  `Venta #${ventaId} realizada por $${total}`

);

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