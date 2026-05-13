const pool =
  require('../config/db');

const Inventory =
  require('../inventory/inventory.model');

const Log =
  require('../logs/log.model');

const Sale = {

  // =========================
  // CREATE SALE
  // =========================

  async create(cart){

    if(
      !Array.isArray(cart) ||
      cart.length === 0
    ){

      throw new Error(
        'Carrito vacío'
      );

    }

    const conn =
      await pool.getConnection();

    try {

      await conn.beginTransaction();

      let total = 0;

      // =========================
      // VALIDATE PRODUCTS
      // =========================

      for(const item of cart){

        if(
          !item.id ||
          !item.qty ||
          item.qty <= 0
        ){

          throw new Error(
            'Producto inválido'
          );

        }

        // =========================
        // PRODUCT EXISTS
        // =========================

        const [rows] =
          await conn.query(
            `
            SELECT *
            FROM productos
            WHERE id = ?
            LIMIT 1
            `,
            [item.id]
          );

        if(!rows.length){

          throw new Error(
            `Producto ${item.id} no existe`
          );

        }

        const product =
          rows[0];

        // =========================
        // VALIDATE STOCK
        // =========================

        if(
          product.cantidad < item.qty
        ){

          throw new Error(
            `Stock insuficiente para ${product.nombre}`
          );

        }

        total +=
          Number(product.precio) *
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
      // PROCESS ITEMS
      // =========================

      for(const item of cart){

        // =========================
        // GET PRODUCT
        // =========================

        const [rows] =
          await conn.query(
            `
            SELECT *
            FROM productos
            WHERE id = ?
            LIMIT 1
            `,
            [item.id]
          );

        const product =
          rows[0];

        const oldStock =
          product.cantidad;

        const newStock =
          oldStock - item.qty;

        const subtotal =
          Number(product.precio) *
          item.qty;

        // =========================
        // INSERT ITEM
        // =========================

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
            product.id,
            product.nombre,
            product.precio,
            item.qty,
            subtotal
          ]
        );

        // =========================
        // UPDATE PRODUCT
        // =========================

        await conn.query(
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
            product.id
          ]
        );

        // =========================
        // INVENTORY LOG
        // =========================

        await Inventory.log({

          producto_id:
            product.id,

          action:
            'checkout',

          old_stock:
            oldStock,

          new_stock:
            newStock

        });

      }

      // =========================
      // COMMIT
      // =========================

      await conn.commit();

      // =========================
      // SYSTEM LOG
      // =========================

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