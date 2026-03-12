const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const auth = require('../middlewares/auth');

router.get('/courses', auth, teacherController.getCourses);
router.post('/courses', auth, teacherController.createCourse);
router.get('/courses-with-students', auth, teacherController.getCoursesWithStudents);
router.get('/courses/:courseId/students', auth, teacherController.getCourseStudents);
router.post('/scores', auth, teacherController.submitScores);
router.post('/attendance', auth, teacherController.recordAttendance);

// 新增接口
router.get('/stats', auth, teacherController.getTeacherStats);
router.get('/score-distribution', auth, teacherController.getScoreDistribution);

module.exports = router;