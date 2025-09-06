const { dbPool } = require("../config/db");

// GET course cover by faculty_id & course_id
const getCourseCover = async (req, res) => {
  try {
    const { facultyId, courseId } = req.params;

    const [rows] = await dbPool.query(
      `SELECT * FROM course_cover_page WHERE faculty_id = ? AND course_id = ?`,
      [facultyId, courseId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Course cover not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching course cover:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE or UPDATE course cover (UPSERT)
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

    const [result] = await dbPool.query(
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
