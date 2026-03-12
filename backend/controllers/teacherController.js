const pool = require('../config/db');

// 获取教师的所有课程
exports.getCourses = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, code, credit, teacher, current_student FROM courses WHERE teacher = ?',
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 创建新课程
exports.createCourse = async (req, res) => {
  try {
    const { name, code, credit } = req.body;
    const teacherId = req.user.id;
    await pool.query(
      'INSERT INTO courses (name, code, credit, teacher) VALUES (?, ?, ?, ?)',
      [name, code, credit, teacherId]
    );
    res.json({ message: '课程创建成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取有学生选课的课程
exports.getCoursesWithStudents = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT c.id, c.name, c.code, c.credit, c.teacher, c.current_student
      FROM courses c
      LEFT JOIN selected_courses sc ON c.id = sc.course_id
      WHERE c.teacher = ?
    `, [req.user.id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取某课程的学生名单
exports.getCourseStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const [rows] = await pool.query(`
      SELECT u.id, u.name, s.score 
      FROM users u
      JOIN selected_courses sc ON u.id = sc.student_id
      LEFT JOIN scores s ON u.id = s.student_id AND sc.course_id = s.course_id
      WHERE sc.course_id = ? AND u.role = 'student'
    `, [courseId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 提交成绩
exports.submitScores = async (req, res) => {
  try {
    const { scores } = req.body;
    for (const score of scores) {
      const [existing] = await pool.query(
        'SELECT * FROM scores WHERE student_id = ? AND course_id = ?',
        [score.studentId, score.courseId]
      );
      if (existing.length > 0) {
        await pool.query(
          'UPDATE scores SET score = ? WHERE student_id = ? AND course_id = ?',
          [score.score, score.studentId, score.courseId]
        );
      } else {
        await pool.query(
          'INSERT INTO scores (student_id, course_id, score) VALUES (?, ?, ?)',
          [score.studentId, score.courseId, score.score]
        );
      }
    }
    res.json({ message: '成绩提交成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 记录出勤
exports.recordAttendance = async (req, res) => {
  try {
    const { courseId, studentId, status } = req.body;
    await pool.query(
      'INSERT INTO attendance (course_id, student_id, status, date) VALUES (?, ?, ?, NOW())',
      [courseId, studentId, status]
    );
    res.json({ message: '出勤记录成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取教师统计数据（教授课程数、授课学生数、平均成绩）
exports.getTeacherStats = async (req, res) => {
  try {
    const teacherId = req.user.id;
    console.log('teacherId:', teacherId, 'typeof:', typeof teacherId);

    // 1. 教授课程数
    let courseCount = 0;
    try {
      const [courses] = await pool.query(
        'SELECT COUNT(*) as count FROM courses WHERE teacher = ?',
        [teacherId]
      );
      console.log('courses query result:', courses);
      courseCount = courses[0]?.count || 0;
    } catch (err) {
      console.error('courses query error:', err);
    }

    // 2. 授课学生数（去重）
    let studentCount = 0;
    try {
      const [students] = await pool.query(
        'SELECT COUNT(DISTINCT sc.student_id) as count FROM selected_courses sc JOIN courses c ON sc.course_id = c.id WHERE c.teacher = ?',
        [teacherId]
      );
      console.log('students query result:', students);
      studentCount = students[0]?.count || 0;
    } catch (err) {
      console.error('students query error:', err);
    }

    // 3. 平均成绩（改用手动统计成绩列表，避免AVG函数问题）
    let averageScore = '0.00';
    try {
      // 查询当前教师所有课程对应的成绩
      const [scoreList] = await pool.query(
        'SELECT s.score FROM scores s JOIN courses c ON s.course_id = c.id WHERE c.teacher = ?',
        [teacherId]
      );
      console.log('scoreList:', scoreList); // 调试：查看实际成绩数据

      // 计算平均成绩
      if (scoreList.length > 0) {
        const totalScore = scoreList.reduce((sum, item) => {
          return sum + (item.score || 0); // 兼容可能的空值
        }, 0);
        averageScore = (totalScore / scoreList.length).toFixed(2);
      }
    } catch (err) {
      console.error('scores query error:', err);
    }

    res.json({
      courseCount,
      studentCount,
      averageScore
    });
  } catch (error) {
    console.error('获取教师统计数据失败:', error);
    res.status(500).json({ 
      message: '获取教师统计数据失败', 
      error: error.message,
      stack: error.stack
    });
  }
};

// 获取成绩分布统计
exports.getScoreDistribution = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const [rows] = await pool.query(`
      SELECT 
        CASE 
          WHEN s.score BETWEEN 0 AND 59 THEN '0-59'
          WHEN s.score BETWEEN 60 AND 69 THEN '60-69'
          WHEN s.score BETWEEN 70 AND 79 THEN '70-79'
          WHEN s.score BETWEEN 80 AND 89 THEN '80-89'
          WHEN s.score BETWEEN 90 AND 100 THEN '90-100'
        END AS score_range,
        COUNT(*) AS student_count
      FROM scores s
      JOIN courses c ON s.course_id = c.id
      WHERE c.teacher = ?
      GROUP BY score_range
      ORDER BY score_range;
    `, [teacherId]);

    // 初始化各分数段人数为 0
    const distribution = {
      '0-59': 0,
      '60-69': 0,
      '70-79': 0,
      '80-89': 0,
      '90-100': 0
    };

    // 填充数据库统计结果
    rows.forEach(row => {
      if (row.score_range) {
        distribution[row.score_range] = row.student_count;
      }
    });

    // 转换为数组
    const result = [
      distribution['0-59'],
      distribution['60-69'],
      distribution['70-79'],
      distribution['80-89'],
      distribution['90-100']
    ];

    res.json(result);
  } catch (error) {
    console.error('获取成绩分布失败:', error);
    res.status(500).json({ message: '获取成绩分布失败' });
  }
};