const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/auth');

router.get('/users', auth, adminController.getUsers);
router.post('/users', auth, adminController.addUser);
router.put('/users/:id', auth, adminController.updateUser);
router.delete('/users/:id', auth, adminController.deleteUser);

router.get('/courses', auth, adminController.getCourses);
router.post('/courses', auth, adminController.addCourse);
router.put('/courses/:id', auth, adminController.updateCourse);
router.delete('/courses/:id', auth, adminController.deleteCourse);

module.exports = router;