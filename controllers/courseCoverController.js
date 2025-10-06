const { dbPool } = require("../config/db");
const { db } = require("../config/db");

// ============================
// GET course cover by faculty + course
// ============================
const getCourseCover = async (req, res) => {
  try {
    const { facultyId, offeringId } = req.params;

    // ✅ 1. Try fetching from course_cover_page
    const [rows] = await db.query(
      "SELECT * FROM course_cover_page WHERE faculty_id = ? AND offering_id = ?",
      [facultyId, offeringId]
    );

    // ✅ 2. If found, return directly
    if (rows && rows.length > 0) {
      return res.json(rows[0]);
    }

    // ✅ 3. Else, fetch fallback from course_offering and related tables
    const [fallbackRows] = await dbPool.query(
      `
      SELECT 
        c.course_id,
        c.name AS courseName,
        c.code AS courseCode,
        c.nba AS nbaCode,
        CONCAT('Sem ', s.sem, ' - ', sec.name) AS semesterSection,
        CONCAT(b.start_year, '-', b.end_year) AS academicYear,
        MAX(CASE WHEN cta.role = 'instructor' THEN f.name END) AS facultyIncharge,
        MAX(CASE WHEN cta.role = 'coordinator' THEN f.name END) AS courseCoordinator,
        MAX(f.faculty_id) AS facultyId
      FROM course_offering co
      JOIN course c ON c.course_id = co.course_id
      LEFT JOIN sem s ON s.sem_id = co.sem_id
      LEFT JOIN batch b ON b.batch_id = co.batch_id
      LEFT JOIN course_teaching_assignment cta ON cta.offering_id = co.offering_id
      LEFT JOIN faculty f ON f.faculty_id = cta.faculty_id
      LEFT JOIN section sec ON sec.section_id = cta.section_id
      WHERE co.offering_id = ?
      GROUP BY co.offering_id, c.course_id, c.name, c.code, c.nba, s.sem, sec.name, b.start_year, b.end_year
      LIMIT 1
      `,
      [offeringId]
    );

    if (!fallbackRows || fallbackRows.length === 0) {
      return res.status(404).json({ message: "Course cover not found" });
    }

    return res.json(fallbackRows[0]);
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
    const { facultyId, offeringId } = req.params;
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
        (faculty_id, offering_id, courseName, courseCode, nbaCode, semesterSection, academicYear, facultyIncharge, courseCoordinator)
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
        offeringId,
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

// ============================
// FALLBACK: offeringId only (dynamic from DB)
// ============================
const getCourseCoverFallback = async (req, res) => {
  try {
    const { offeringId } = req.params;

    const [rows] = await dbPool.query(
      `
      SELECT 
        c.course_id,
        c.name AS courseName,
        c.code AS courseCode,
        c.nba AS nbaCode,
        CONCAT('Sem ', s.sem, ' - ', sec.name) AS semesterSection,
        CONCAT(b.start_year, '-', b.end_year) AS academicYear,
        MAX(CASE WHEN cta.role = 'instructor' THEN f.name END) AS facultyIncharge,
        MAX(CASE WHEN cta.role = 'coordinator' THEN f.name END) AS courseCoordinator,
        MAX(f.faculty_id) AS facultyId
      FROM course_offering co
      JOIN course c ON c.course_id = co.course_id
      LEFT JOIN sem s ON s.sem_id = co.sem_id
      LEFT JOIN batch b ON b.batch_id = co.batch_id
      LEFT JOIN course_teaching_assignment cta ON cta.offering_id = co.offering_id
      LEFT JOIN faculty f ON f.faculty_id = cta.faculty_id
      LEFT JOIN section sec ON sec.section_id = cta.section_id
      WHERE co.offering_id = ?
      GROUP BY co.offering_id, c.course_id, c.name, c.code, c.nba, s.sem, sec.name, b.start_year, b.end_year
      LIMIT 1
      `,
      [offeringId]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Course cover not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching fallback course cover:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getCourseCover, upsertCourseCover, getCourseCoverFallback };
