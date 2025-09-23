const express = require("express");
const router = express.Router();
const tsoController = require("../controllers/tsoController");

// ✅ Get all TSO-related data for a course
// Example: GET /api/tso/123
router.get("/:courseId", tsoController.getCourseData);

// ✅ Save or update course info (manual save)
// Example: POST /api/tso/save-course-info
router.post("/save-course-info", tsoController.saveCourseInfo);

// ✅ Add module with nested contents + tso details
// Example: POST /api/tso/add-module
router.post("/add-module", tsoController.addModule);

module.exports = router;
