// const express = require("express");
// const router = express.Router();
// const { addCourse, getCourses } = require("../controllers/courseController");

// router.post("/", addCourse);
// router.get("/", getCourses);

// module.exports = router;

const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

// CRUD for courses
router.get("/", courseController.getCourses);
router.post("/", courseController.createCourse);
router.put("/:id", courseController.updateCourse);
router.delete("/:id", courseController.deleteCourse);

// Manage course types
router.get('/course-types', courseController.getCourseTypes);
router.post('/course-types', courseController.addCourseType);

module.exports = router;
