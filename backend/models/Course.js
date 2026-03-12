const pool = require('../config/db');

class Course {
  /**
   * 创建新课程
   * @param {Object} courseData - 课程数据
   * @returns {Promise<Object>} - 创建的课程
   */
  static async create(courseData) {
    const { name, code, credit, teacher } = courseData;
    
    // 检查课程代码是否已存在
    const [existingCourses] = await pool.query(
      'SELECT * FROM courses WHERE code = ?',
      [code]
    );
    
    if (existingCourses.length > 0) {
      throw new Error('课程代码已存在');
    }
    
    // 插入新课程
    const [result] = await pool.query(
      'INSERT INTO courses (name, code, credit, teacher) VALUES (?, ?, ?, ?)',
      [name, code, credit, teacher]
    );
    
    // 返回创建的课程
    return {
      id: result.insertId,
      name,
      code,
      credit,
      teacher
    };
  }

  /**
   * 根据ID查找课程
   * @param {number} id - 课程ID
   * @returns {Promise<Object|null>} - 课程对象或null
   */
  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT c.*, u.name as teacherName FROM courses c LEFT JOIN users u ON c.teacher = u.id WHERE c.id = ?',
      [id]
    );
    
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * 根据教师ID查找课程
   * @param {number} teacherId - 教师ID
   * @returns {Promise<Array>} - 课程列表
   */
  static async findByTeacher(teacherId) {
    const [rows] = await pool.query(
      'SELECT * FROM courses WHERE teacher = ?',
      [teacherId]
    );
    
    return rows;
  }

  /**
   * 更新课程信息
   * @param {number} id - 课程ID
   * @param {Object} updates - 更新的数据
   * @returns {Promise<Object>} - 更新后的课程
   */
  static async update(id, updates) {
    const { name, code, credit, teacher } = updates;
    
    const [result] = await pool.query(
      'UPDATE courses SET name = ?, code = ?, credit = ?, teacher = ? WHERE id = ?',
      [name, code, credit, teacher, id]
    );
    
    if (result.affectedRows === 0) {
      throw new Error('课程不存在');
    }
    
    return await this.findById(id);
  }

  /**
   * 删除课程
   * @param {number} id - 课程ID
   * @returns {Promise<boolean>} - 是否删除成功
   */
  static async delete(id) {
    const [result] = await pool.query(
      'DELETE FROM courses WHERE id = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }

  /**
   * 获取所有课程
   * @param {Object} options - 查询选项
   * @returns {Promise<Array>} - 课程列表
   */
  static async findAll(options = {}) {
    const { page = 1, size = 10, teacher } = options;
    const offset = (page - 1) * size;
    
    let query = 'SELECT c.*, u.name as teacherName FROM courses c LEFT JOIN users u ON c.teacher = u.id';
    const params = [];
    
    if (teacher) {
      query += ' WHERE c.teacher = ?';
      params.push(teacher);
    }
    
    query += ' LIMIT ? OFFSET ?';
    params.push(size, offset);
    
    const [rows] = await pool.query(query, params);
    
    // 获取总数
    const [countResult] = await pool.query(
      teacher ? 'SELECT COUNT(*) as count FROM courses WHERE teacher = ?' : 'SELECT COUNT(*) as count FROM courses',
      teacher ? [teacher] : []
    );
    
    return {
      courses: rows,
      total: countResult[0].count
    };
  }

  /**
   * 获取学生未选的课程
   * @param {number} studentId - 学生ID
   * @returns {Promise<Array>} - 可选课程列表
   */
  static async findAvailableForStudent(studentId) {
    const [rows] = await pool.query(
      `SELECT c.id, c.name, c.code, c.credit, u.name as teacherName 
       FROM courses c 
       LEFT JOIN users u ON c.teacher = u.id 
       WHERE c.id NOT IN (
         SELECT course_id FROM selected_courses WHERE student_id = ?
       )`,
      [studentId]
    );
    
    return rows;
  }
}

module.exports = Course;