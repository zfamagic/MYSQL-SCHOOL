const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: '没有权限访问' });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);

    // 确保 id 是数字
    if (decoded.id !== undefined && decoded.id !== null) {
      decoded.id = parseInt(decoded.id, 10);
      if (isNaN(decoded.id)) {
        return res.status(401).json({ message: 'Token 中的用户 ID 无效' });
      }
    } else {
      return res.status(401).json({ message: 'Token 中缺少用户 ID' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token 无效' });
  }
};