const mysql = require('mysql2/promise');

console.log("DB CONFIG:", {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

module.exports = pool;