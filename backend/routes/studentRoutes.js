const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middlewares/auth'); // 引入JWT认证中间件

// 所有学生接口都需要先通过JWT认证
// 中间件 auth 会解析 token 并将用户信息存入 req.user

/**
 * @route   GET /api/student/courses/available
 * @desc    获取可选课程列表
 * @access  Private (Student)
 */
router.get('/courses/available', auth, studentController.getAvailableCourses);

/**
 * @route   POST /api/student/courses/select
 * @desc    选课接口
 * @access  Private (Student)
 */
router.post('/courses/select', auth, studentController.selectCourse);

/**
 * @route   DELETE /api/student/courses/:courseId
 * @desc    退课接口
 * @access  Private (Student)
 */
router.delete('/courses/:courseId', auth, studentController.dropCourse);

/**
 * @route   GET /api/student/courses/selected  ✅ 修复：添加已选课程路由
 * @desc    获取已选课程列表
 * @access  Private (Student)
 */
router.get('/courses/selected', auth, studentController.getSelectedCourses);

/**
 * @route   GET /api/student/scores
 * @desc    获取学生成绩列表
 * @access  Private (Student)
 */
router.get('/scores', auth, studentController.getScores);

module.exports = router;