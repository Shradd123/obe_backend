// const express = require('express');
// const router = express.Router();
// const { getCoursesByBatchSem } = require('../controllers/batchSemCoursesController');
// const { getCoursesByBatchSems } = require('../controllers/batchSemCoursesController');

// // GET /api/batch/:batchId/sem/:semId/courses
// router.get('/batch/:batchId/sem/:semId/courses', getCoursesByBatchSem);
// router.get('/batch/:batchId/sems/:semId/courses', getCoursesByBatchSems);

// module.exports = router;

const express = require('express');
const router = express.Router();
const { 
  getCoursesByBatchSem, 
  getCoursesByBatchSems 
} = require('../controllers/batchSemCoursesController');

// ✅ Get courses for a specific batch + semester (filtered by facultyId if provided)
// Example: /api/batch/1/sem/3/courses?facultyId=7
router.get('/batch/:batchId/sem/:semId/courses', getCoursesByBatchSem);

// ✅ Optional route if you need to handle multiple semesters at once
router.get('/batch/:batchId/sems/:semId/courses', getCoursesByBatchSems);

module.exports = router;
