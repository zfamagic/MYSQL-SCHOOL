const pool = require('../config/db');

class Score {
  /**
   * 为学生设置成绩
   * @param {Object} scoreData - 成绩数据
   * @returns {Promise<Object>} - 设置的成绩
   */
  static async setScore(scoreData) {
    const { studentId, courseId, score, semester } = scoreData;
    
    // 检查是否已存在该学生的该课程成绩
    const [existingScores] = await pool.query(
      'SELECT * FROM scores WHERE student_id = ? AND course_id = ?',
      [studentId, courseId]
    );
    
    if (existingScores.length > 0) {
      // 更新成绩
      const [result] = await pool.query(
        'UPDATE scores SET score = ?, semester = ? WHERE student_id = ? AND course_id = ?',
        [score, semester, studentId, courseId]
      );
      
      return {
        id: existingScores[0].id,
        studentId,
        courseId,
        score,
        semester,
        updated: true
      };
    } else {
      // 插入新成绩
      const [result] = await pool.query(
        'INSERT INTO scores (student_id, course_id, score, semester) VALUES (?, ?, ?, ?)',
        [studentId, courseId, score, semester]
      );
      
      return {
        id: result.insertId,
        studentId,
        courseId,
        score,
        semester,
        updated: false
      };
    }
  }

  /**
   * 获取学生的课程成绩
   * @param {number} studentId - 学生ID
   * @param {number} courseId - 课程ID
   * @returns {Promise<Object|null>} - 成绩对象或null
   */
  static async findByStudentAndCourse(studentId, courseId) {
    const [rows] = await pool.query(
      'SELECT * FROM scores WHERE student_id = ? AND course_id = ?',
      [studentId, courseId]
    );
    
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * 获取学生的所有成绩
   * @param {number} studentId - 学生ID
   * @returns {Promise<Array>} - 成绩列表
   */
  static async findByStudent(studentId) {
    const [rows] = await pool.query(
      `SELECT s.*, c.name as courseName, c.code as courseCode, c.credit 
       FROM scores s 
       LEFT JOIN courses c ON s.course_id = c.id 
       WHERE s.student_id = ?`,
      [studentId]
    );
    
    return rows;
  }

  /**
   * 获取课程的所有学生成绩
   * @param {number} courseId - 课程ID
   * @returns {Promise<Array>} - 成绩列表
   */
  static async findByCourse(courseId) {
    const [rows] = await pool.query(
      `SELECT s.*, u.name as studentName 
       FROM scores s 
       LEFT JOIN users u ON s.student_id = u.id 
       WHERE s.course_id = ?`,
      [courseId]
    );
    
    return rows;
  }

  /**
   * 删除成绩
   * @param {number} id - 成绩ID
   * @returns {Promise<boolean>} - 是否删除成功
   */
  static async delete(id) {
    const [result] = await pool.query(
      'DELETE FROM scores WHERE id = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }

  /**
   * 获取成绩统计信息
   * @param {number} courseId - 课程ID
   * @returns {Promise<Object>} - 统计信息
   */
  static async getStatistics(courseId) {
    const [rows] = await pool.query(
      `SELECT 
         COUNT(*) as total,
         AVG(score) as average,
         MIN(score) as min,
         MAX(score) as max,
         SUM(CASE WHEN score >= 90 THEN 1 ELSE 0 END) as excellent,
         SUM(CASE WHEN score >= 80 AND score < 90 THEN 1 ELSE 0 END) as good,
         SUM(CASE WHEN score >= 70 AND score < 80 THEN 1 ELSE 0 END) as medium,
         SUM(CASE WHEN score >= 60 AND score < 70 THEN 1 ELSE 0 END) as pass,
         SUM(CASE WHEN score < 60 THEN 1 ELSE 0 END) as fail
       FROM scores 
       WHERE course_id = ?`,
      [courseId]
    );
    
    return rows[0];
  }
}

module.exports = Score;