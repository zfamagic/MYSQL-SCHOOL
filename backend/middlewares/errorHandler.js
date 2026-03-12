const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  // 记录错误日志
  logger.error(`${err.name}: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query
  });

  // 区分开发环境和生产环境的错误处理
  if (process.env.NODE_ENV === 'development') {
    return res.status(500).json({
      message: err.message,
      error: err,
      stack: err.stack
    });
  }

  // 生产环境下的错误处理
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      details: err.message
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: 'Unauthorized',
      details: 'Invalid or expired token'
    });
  }

  // 通用错误处理
  res.status(500).json({
    message: 'Internal Server Error',
    details: 'An unexpected error occurred'
  });
};