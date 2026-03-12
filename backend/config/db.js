const mysql = require('mysql2/promise');
const { db } = require('./config'); // 从 config.js 读取数据库配置

const pool = mysql.createPool({
  host: db.host,
  user: db.user,
  password: db.password,
  database: db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;