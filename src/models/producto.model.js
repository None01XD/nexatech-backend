const pool = require('../config/db');

const Producto = {
  async create({ nombre, precio, cantidad }) {
    const sql = 'INSERT INTO productos (nombre, precio, cantidad) VALUES (?, ?, ?)';
    const [result] = await pool.execute(sql, [nombre, precio, cantidad]);
    return { id: result.insertId, nombre, precio, cantidad };
  },

  async findAll() {
    const sql = 'SELECT * FROM productos ORDER BY id DESC';
    const [rows] = await pool.execute(sql);
    return rows;
  },

  async findById(id) {
    const sql = 'SELECT * FROM productos WHERE id = ? LIMIT 1';
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  },

  async update(id, { nombre, precio, cantidad }) {
    const sql = 'UPDATE productos SET nombre = ?, precio = ?, cantidad = ? WHERE id = ?';
    const [result] = await pool.execute(sql, [nombre, precio, cantidad, id]);
    return result.affectedRows > 0;
  },

  async remove(id) {
    const sql = 'DELETE FROM productos WHERE id = ?';
    const [result] = await pool.execute(sql, [id]);
    return result.affectedRows > 0;
  }
};

module.exports = Producto;
