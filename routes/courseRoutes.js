// const express = require("express");
// const router = express.Router();
// const { addCourse, getCourses } = require("../controllers/courseController");

// router.post("/", addCourse);
// router.get("/", getCourses);

// module.exports = router;


const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { getCoursesByBatchSem } = require('../controllers/courseController');

// Routes
router.get("/", courseController.getCourses);
router.post("/", courseController.createCourse);
router.put("/:id", courseController.updateCourse);
router.delete("/:id", courseController.deleteCourse);


router.get('/course-types', courseController.getCourseTypes);
router.post('/course-types', courseController.addCourseType);
router.get('/:batchId/:semId', getCoursesByBatchSem);

module.exports = router;

