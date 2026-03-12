const pool = require('../config/db');

class SelectedCourse {
  /**
   * 学生选课
   * @param {Object} selectionData - 选课数据
   * @returns {Promise<Object>} - 选课记录
   */
  static async selectCourse(selectionData) {
    const { studentId, courseId } = selectionData;
    
    // 检查是否已选该课程
    const [existingSelections] = await pool.query(
      'SELECT * FROM selected_courses WHERE student_id = ? AND course_id = ?',
      [studentId, courseId]
    );
    
    if (existingSelections.length > 0) {
      throw new Error('已选择该课程');
    }
    
    // 插入选课记录
    const [result] = await pool.query(
      'INSERT INTO selected_courses (student_id, course_id, selected_time) VALUES (?, ?, NOW())',
      [studentId, courseId]
    );
    
    // 返回选课记录
    return {
      id: result.insertId,
      studentId,
      courseId,
      selectedTime: new Date()
    };
  }

  /**
   * 学生退课
   * @param {number} studentId - 学生ID
   * @param {number} courseId - 课程ID
   * @returns {Promise<boolean>} - 是否退课成功
   */
  static async dropCourse(studentId, courseId) {
    const [result] = await pool.query(
      'DELETE FROM selected_courses WHERE student_id = ? AND course_id = ?',
      [studentId, courseId]
    );
    
    return result.affectedRows > 0;
  }

  /**
   * 获取学生已选的课程
   * @param {number} studentId - 学生ID
   * @returns {Promise<Array>} - 已选课程列表
   */
  static async findByStudent(studentId) {
    const [rows] = await pool.query(
      `SELECT sc.*, c.name as courseName, c.code as courseCode, c.credit, u.name as teacherName 
       FROM selected_courses sc 
       LEFT JOIN courses c ON sc.course_id = c.id 
       LEFT JOIN users u ON c.teacher = u.id 
       WHERE sc.student_id = ?`,
      [studentId]
    );
    
    return rows;
  }

  /**
   * 获取课程的所有选课学生
   * @param {number} courseId - 课程ID
   * @returns {Promise<Array>} - 学生列表
   */
  static async findByCourse(courseId) {
    const [rows] = await pool.query(
      `SELECT sc.*, u.name as studentName, u.username 
       FROM selected_courses sc 
       LEFT JOIN users u ON sc.student_id = u.id 
       WHERE sc.course_id = ?`,
      [courseId]
    );
    
    return rows;
  }

  /**
   * 检查学生是否已选该课程
   * @param {number} studentId - 学生ID
   * @param {number} courseId - 课程ID
   * @returns {Promise<boolean>} - 是否已选
   */
  static async isSelected(studentId, courseId) {
    const [rows] = await pool.query(
      'SELECT * FROM selected_courses WHERE student_id = ? AND course_id = ?',
      [studentId, courseId]
    );
    
    return rows.length > 0;
  }

  /**
   * 获取选课统计信息
   * @param {number} courseId - 课程ID
   * @returns {Promise<Object>} - 统计信息
   */
  static async getStatistics(courseId) {
    const [rows] = await pool.query(
      `SELECT 
         COUNT(*) as totalStudents,
         (SELECT COUNT(*) FROM users WHERE role = 'student') as totalStudentsInSystem,
         ROUND(COUNT(*) / (SELECT COUNT(*) FROM users WHERE role = 'student') * 100, 2) as selectionRate
       FROM selected_courses 
       WHERE course_id = ?`,
      [courseId]
    );
    
    return rows[0];
  }
}

module.exports = SelectedCourse;