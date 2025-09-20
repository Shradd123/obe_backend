const express = require("express");
const router = express.Router();
const { getCourseCover, upsertCourseCover, getCourseCoverFallback } = require("../controllers/courseCoverController");

// ============================
// GET course cover by faculty + course
// ============================
router.get("/:facultyId/:courseId", getCourseCover);

// ============================
// UPSERT course cover
// ============================
router.post("/:facultyId/:courseId", upsertCourseCover);

// ============================
// FALLBACK: courseId only (dynamic from DB)
// ============================
router.get("/fallback/:courseId", getCourseCoverFallback);

module.exports = router;
