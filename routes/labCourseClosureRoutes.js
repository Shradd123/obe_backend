// const express = require('express');
// const router = express.Router();
// const {
//   getLabCourseClosure,
//   saveLabCourseClosure
// } = require('../controllers/labCourseClosureController');

// // ✅ GET closure data for a given offering
// router.get('/:offering_id', getLabCourseClosure);

// // ✅ SAVE/UPDATE closure data
// router.post('/:offering_id', saveLabCourseClosure);

// module.exports = router;


const express = require('express');
const router = express.Router();
const {
  getLabCourseClosure,
  saveLabCourseClosure
} = require('../controllers/labCourseClosureController');

router.get('/:offering_id', getLabCourseClosure);
router.post('/:offering_id', saveLabCourseClosure);

module.exports = router;
