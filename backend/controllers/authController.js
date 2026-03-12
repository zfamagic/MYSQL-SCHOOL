const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');
const response = require('../utils/response');
const logger = require('../utils/logger');

exports.login = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    
    // 验证输入
    if (!username || !password || !role) {
      return res.status(400).json({ message: '用户名、密码和角色不能为空' });
    }
    
    // 查找用户
    const user = await User.findByUsername(username);
    
    if (!user) {
      logger.warn(`登录失败: 用户不存在 - ${username}`);
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    // 验证角色
    if (user.role !== role) {
      logger.warn(`登录失败: 角色不匹配 - ${username} (期望: ${role}, 实际: ${user.role})`);
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    // 验证密码（已修改为bcrypt验证）
    const isMatch = await User.verifyPassword(password, user.password);
    
    if (!isMatch) {
      logger.warn(`登录失败: 密码错误 - ${username}`);
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    // 生成JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      jwtSecret,
      { expiresIn: '1d' }
    );
    
    logger.info(`登录成功 - ${username}`);
    
    // 返回响应
    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name
      },
      message: '登录成功'
    });
    
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  res.json({ message: '注销成功' });
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    res.json(user);
  } catch (error) {
    next(error);
  }
};