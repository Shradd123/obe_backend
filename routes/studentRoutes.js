// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/section/:sectionId', studentController.getStudentsBySection);
router.post('/', studentController.addStudent);

module.exports = router;
