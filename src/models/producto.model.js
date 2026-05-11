const pool = require('../config/db');

const Producto = {

  // =========================
  // CREATE
  // =========================

  async create({ nombre, precio, cantidad }) {

    const status = cantidad > 0
      ? 'disponible'
      : 'agotado';

    const sql = `
      INSERT INTO productos
      (nombre, precio, cantidad, status)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.query(
      sql,
      [nombre, precio, cantidad, status]
    );

    return {
      id: result.insertId,
      nombre,
      precio,
      cantidad,
      status
    };

  },

  // =========================
  // FIND ALL
  // =========================

  async findAll() {

    const sql = `
      SELECT *
      FROM productos
      ORDER BY id DESC
    `;

    const [rows] = await pool.query(sql);

    return rows;

  },

  // =========================
  // FIND BY ID
  // =========================

  async findById(id) {

    const sql = `
      SELECT *
      FROM productos
      WHERE id = ?
      LIMIT 1
    `;

    const [rows] = await pool.query(sql, [id]);

    return rows[0] || null;

  },

  // =========================
  // UPDATE
  // =========================

  async update(id, data) {

    const {
      nombre,
      precio,
      cantidad
    } = data;

    const status = cantidad > 0
      ? 'disponible'
      : 'agotado';

    const sql = `
      UPDATE productos
      SET
        nombre = ?,
        precio = ?,
        cantidad = ?,
        status = ?
      WHERE id = ?
    `;

    const [result] = await pool.query(
      sql,
      [
        nombre,
        precio,
        cantidad,
        status,
        id
      ]
    );

    return result.affectedRows > 0;

  },

  // =========================
  // DELETE
  // =========================

  async remove(id) {

    const sql = `
      DELETE FROM productos
      WHERE id = ?
    `;

    const [result] = await pool.query(sql, [id]);

    return result.affectedRows > 0;

  }

};

module.exports = Producto;