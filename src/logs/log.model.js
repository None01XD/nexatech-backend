const pool =
  require('../config/db');

const Log = {

  async create(action, details){

    await pool.query(
      `
      INSERT INTO logs
      (action, details)
      VALUES (?, ?)
      `,
      [action, details]
    );

  }

};

module.exports = Log; 