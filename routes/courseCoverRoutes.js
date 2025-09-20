const express = require("express");
const router = express.Router();
const { getCourseCover, upsertCourseCover } = require("../controllers/courseCoverController");
const { dbPool } = require("../config/db");

// ============================
// GET course cover by faculty + course
// ============================
router.get("/:facultyId/:courseId", getCourseCover);

// ============================
// UPSERT course cover
// ============================
router.post("/:facultyId/:courseId", upsertCourseCover);

// ============================
// NEW fallback route: courseId only
// ============================
router.get("/fallback/:courseId", async (req, res) => {
  const { courseId } = req.params;

  try {
    const [rows] = await dbPool.query(
      `
      SELECT 
        c.course_id,
        c.name AS courseName,
        c.code AS courseCode,
        c.nba AS nbaCode,
        COALESCE(ccp.semesterSection, 'N/A') AS semesterSection,
        COALESCE(ccp.academicYear, 'N/A') AS academicYear,
        COALESCE(ccp.facultyIncharge, 'N/A') AS facultyIncharge,
        COALESCE(ccp.courseCoordinator, 'N/A') AS courseCoordinator,
        COALESCE(ccp.faculty_id, NULL) AS facultyId
      FROM course c
      LEFT JOIN course_cover_page ccp ON ccp.course_id = c.course_id
      WHERE c.course_id = ?
      LIMIT 1
      `,
      [courseId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching fallback course cover:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
