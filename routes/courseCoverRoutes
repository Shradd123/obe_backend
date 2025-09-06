const express = require("express");
const router = express.Router();
const { getCourseCover, upsertCourseCover } = require("../controllers/courseCoverController");

// GET course cover by faculty + course
router.get("/course-cover-page/:facultyId/:courseId", getCourseCover);

// CREATE / UPDATE course cover by faculty + course
router.post("/course-cover-page/:facultyId/:courseId", upsertCourseCover);

module.exports = router;
