const { dbPool } = require("../config/db");

// ============================
// GET course cover by faculty + course
// ============================
const getCourseCover = async (req, res) => {
  try {
    const { facultyId, courseId } = req.params;

    // Try fetching from course_cover_page
    const [rows] = await dbPool.query(
      `SELECT * FROM course_cover_page WHERE faculty_id = ? AND course_id = ?`,
      [facultyId, courseId]
    );

    if (rows.length > 0) {
      return res.json(rows[0]);
    }

    // fallback if not found
    const [fallbackRows] = await dbPool.query(
      `
      SELECT 
        c.course_id,
        c.name AS courseName,
        c.code AS courseCode,
        c.nba AS nbaCode,
        'N/A' AS semesterSection,
        'N/A' AS academicYear,
        'N/A' AS facultyIncharge,
        'N/A' AS courseCoordinator
      FROM course c
      WHERE c.course_id = ?
      LIMIT 1
      `,
      [courseId]
    );

    if (fallbackRows.length === 0) {
      return res.status(404).json({ message: "Course cover not found" });
    }

    res.json(fallbackRows[0]);
  } catch (err) {
    console.error("Error fetching course cover:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// UPSERT course cover
// ============================
const upsertCourseCover = async (req, res) => {
  try {
    const { facultyId, courseId } = req.params;
    const {
      courseName,
      courseCode,
      nbaCode,
      semesterSection,
      academicYear,
      facultyIncharge,
      courseCoordinator,
    } = req.body;

    await dbPool.query(
      `
      INSERT INTO course_cover_page 
        (faculty_id, course_id, courseName, courseCode, nbaCode, semesterSection, academicYear, facultyIncharge, courseCoordinator)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        courseName = VALUES(courseName),
        courseCode = VALUES(courseCode),
        nbaCode = VALUES(nbaCode),
        semesterSection = VALUES(semesterSection),
        academicYear = VALUES(academicYear),
        facultyIncharge = VALUES(facultyIncharge),
        courseCoordinator = VALUES(courseCoordinator)
      `,
      [
        facultyId,
        courseId,
        courseName,
        courseCode,
        nbaCode,
        semesterSection,
        academicYear,
        facultyIncharge,
        courseCoordinator,
      ]
    );

    res.json({ message: "Course cover saved successfully" });
  } catch (err) {
    console.error("Error saving course cover:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getCourseCover, upsertCourseCover };
