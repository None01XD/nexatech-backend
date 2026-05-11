const pool = require('../config/db');

const Auth = {
  async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ? LIMIT 1';
    const [rows] = await pool.query(sql, [email]);
    return rows[0];
  }
};

module.exports = Auth;