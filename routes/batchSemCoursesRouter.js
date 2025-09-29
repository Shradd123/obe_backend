const express = require('express');
const router = express.Router();
const { getCoursesByBatchSem } = require('../controllers/batchSemCoursesController');
const { getCoursesByBatchSems } = require('../controllers/batchSemCoursesController');

// GET /api/batch/:batchId/sem/:semId/courses
router.get('/batch/:batchId/sem/:semId/courses', getCoursesByBatchSem);
router.get('/batch/:batchId/sems/:semId/courses', getCoursesByBatchSems);

module.exports = router;
