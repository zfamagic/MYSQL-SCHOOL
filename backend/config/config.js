require('dotenv').config(); // 加载 .env 文件

module.exports = {
  port: process.env.PORT || 4000, // 优先读取环境变量，否则默认 4000
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'teaching_system'
  },
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key'
};