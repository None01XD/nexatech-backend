const pool =
  require('../config/db');

const Inventory = {

  async log({
    producto_id,
    action,
    old_stock,
    new_stock
  }){

    const difference_value =
      new_stock - old_stock;

    await pool.query(
      `
      INSERT INTO inventory_logs
      (
        producto_id,
        action,
        old_stock,
        new_stock,
        difference_value
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        producto_id,
        action,
        old_stock,
        new_stock,
        difference_value
      ]
    );

  }

};

module.exports = Inventory;