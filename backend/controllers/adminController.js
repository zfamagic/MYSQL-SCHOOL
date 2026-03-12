const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// 获取所有用户
exports.getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 添加用户
exports.addUser = async (req, res) => {
  try {
    const { username, password, role, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, role, name]
    );
    res.json({ message: '用户添加成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 更新用户
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, role, name } = req.body;
    await pool.query(
      'UPDATE users SET username = ?, role = ?, name = ? WHERE id = ?',
      [username, role, name, id]
    );
    res.json({ message: '用户更新成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 删除用户
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: '用户删除成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取所有课程
exports.getCourses = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, code, credit, teacher, current_student FROM courses'
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 添加课程
exports.addCourse = async (req, res) => {
  try {
    const { name, code, credit, teacher } = req.body;
    await pool.query(
      'INSERT INTO courses (name, code, credit, teacher) VALUES (?, ?, ?, ?)',
      [name, code, credit, teacher]
    );
    res.json({ message: '课程添加成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 更新课程
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, credit, teacher } = req.body;
    await pool.query(
      'UPDATE courses SET name = ?, code = ?, credit = ?, teacher = ? WHERE id = ?',
      [name, code, credit, teacher, id]
    );
    res.json({ message: '课程更新成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 删除课程（级联删除）
exports.deleteCourse = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    console.log('准备删除课程，ID:', id);

    // 获取连接
    connection = await pool.getConnection();

    // 开始事务
    await connection.beginTransaction();

    // 1. 删除成绩记录
    const [scoreResult] = await connection.query(
      'DELETE FROM scores WHERE course_id = ?',
      [id]
    );
    console.log('删除成绩记录数:', scoreResult.affectedRows);

    // 2. 删除选课记录
    const [selectedResult] = await connection.query(
      'DELETE FROM selected_courses WHERE course_id = ?',
      [id]
    );
    console.log('删除选课记录数:', selectedResult.affectedRows);

    // 3. 删除课程
    const [courseResult] = await connection.query(
      'DELETE FROM courses WHERE id = ?',
      [id]
    );
    console.log('删除课程记录数:', courseResult.affectedRows);

    // 提交事务
    await connection.commit();
    console.log('课程及相关数据删除成功');

    res.json({ message: '课程及相关数据删除成功' });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('删除课程失败:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  } finally {
    if (connection) connection.release();
  }
};