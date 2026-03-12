const pool = require('../config/db');

exports.getAvailableCourses = async (req, res) => {
  try {
    const studentId = parseInt(req.user.id, 10);

    const [selected] = await pool.query(
      'SELECT course_id FROM selected_courses WHERE student_id = ?',
      [studentId]
    );
    const selectedIds = selected.map(item => parseInt(item.course_id, 10));

    const [courses] = await pool.query(
      'SELECT c.id, c.name, c.code, c.credit, c.current_student, u.name AS teacherName FROM courses c JOIN users u ON c.teacher = u.id WHERE c.id NOT IN (?)',
      [selectedIds.length > 0 ? selectedIds : [0]]
    );

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

exports.selectCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    await pool.query(
      'INSERT INTO selected_courses (student_id, course_id, selected_time) VALUES (?, ?, NOW())',
      [req.user.id, courseId]
    );
    res.json({ message: '选课成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

exports.dropCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    await pool.query(
      'DELETE FROM selected_courses WHERE student_id = ? AND course_id = ?',
      [req.user.id, courseId]
    );
    res.json({ message: '退课成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

exports.getSelectedCourses = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT c.id, c.name, c.code, c.credit, c.current_student, u.name AS teacherName, sc.selected_time FROM selected_courses sc JOIN courses c ON sc.course_id = c.id JOIN users u ON c.teacher = u.id WHERE sc.student_id = ?',
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

exports.getScores = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT c.name AS courseName, c.code AS courseCode, c.credit, s.score, s.semester FROM scores s JOIN courses c ON s.course_id = c.id WHERE s.student_id = ?',
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};