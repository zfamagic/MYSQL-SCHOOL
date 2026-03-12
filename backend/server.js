const app = require('./app');
const { port } = require('./config/config'); // 从 config.js 读取端口

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});