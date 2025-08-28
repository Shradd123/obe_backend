const express = require('express');
const router = express.Router();
const { getCoursesByBatchSem } = require('../controllers/batchSemCoursesController');

// GET /api/batch/:batchId/sem/:semId/courses
router.get('/batch/:batchId/sem/:semId/courses', getCoursesByBatchSem);



module.exports = router;
