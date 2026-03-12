const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class User {
  /**
   * 创建新用户
   * @param {Object} userData - 用户数据
   * @returns {Promise<Object>} - 创建的用户
   */
  static async create(userData) {
    const { username, password, role, name } = userData;
    
    // 检查用户名是否已存在
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    if (existingUsers.length > 0) {
      throw new Error('用户名已存在');
    }
    
    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 插入新用户
    const [result] = await pool.query(
      'INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, role, name]
    );
    
    // 返回创建的用户
    return {
      id: result.insertId,
      username,
      role,
      name
    };
  }

  /**
   * 根据ID查找用户
   * @param {number} id - 用户ID
   * @returns {Promise<Object|null>} - 用户对象或null
   */
  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, username, role, name FROM users WHERE id = ?',
      [id]
    );
    
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * 根据用户名查找用户
   * @param {string} username - 用户名
   * @returns {Promise<Object|null>} - 用户对象或null
   */
  static async findByUsername(username) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * 验证用户密码（修改为bcrypt验证）
   * @param {string} plainPassword - 明文密码
   * @param {string} hashedPassword - 哈希密码
   * @returns {Promise<boolean>} - 是否匹配
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * 更新用户信息
   * @param {number} id - 用户ID
   * @param {Object} updates - 更新的数据
   * @returns {Promise<Object>} - 更新后的用户
   */
  static async update(id, updates) {
    const { username, role, name } = updates;
    
    const [result] = await pool.query(
      'UPDATE users SET username = ?, role = ?, name = ? WHERE id = ?',
      [username, role, name, id]
    );
    
    if (result.affectedRows === 0) {
      throw new Error('用户不存在');
    }
    
    return await this.findById(id);
  }

  /**
   * 删除用户
   * @param {number} id - 用户ID
   * @returns {Promise<boolean>} - 是否删除成功
   */
  static async delete(id) {
    const [result] = await pool.query(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }

  /**
   * 获取所有用户
   * @param {Object} options - 查询选项
   * @returns {Promise<Array>} - 用户列表
   */
  static async findAll(options = {}) {
    const { page = 1, size = 10, role } = options;
    const offset = (page - 1) * size;
    
    let query = 'SELECT id, username, role, name FROM users';
    const params = [];
    
    if (role) {
      query += ' WHERE role = ?';
      params.push(role);
    }
    
    query += ' LIMIT ? OFFSET ?';
    params.push(size, offset);
    
    const [rows] = await pool.query(query, params);
    
    // 获取总数
    const [countResult] = await pool.query(
      role ? 'SELECT COUNT(*) as count FROM users WHERE role = ?' : 'SELECT COUNT(*) as count FROM users',
      role ? [role] : []
    );
    
    return {
      users: rows,
      total: countResult[0].count
    };
  }
}

module.exports = User;