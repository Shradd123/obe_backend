const { dbPool } = require('../config/db');

// Get Lab Course Cover Page by offering_id
const getLabCourseCoverPage = async (req, res) => {
  try {
    const { offering_id } = req.params;
    if (!offering_id) {
      return res.status(400).json({ message: 'Offering ID is required' });
    }

    // Query to get full course + faculty info
    const [rows] = await dbPool.query(
      `
      SELECT 
        c.course_id,
        c.name AS courseName,
        c.code AS courseCode,
        c.nba AS nbaCode,
        CONCAT('Sem ', s.sem, ' - ', sec.name) AS semesterSection,
        CONCAT(b.start_year, '-', b.end_year) AS academicYear,
        MAX(CASE WHEN cta.role = 'instructor' THEN f.name END) AS courseInstructor,
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
      GROUP BY 
        co.offering_id, c.course_id, c.name, c.code, c.nba, s.sem, sec.name, b.start_year, b.end_year
      LIMIT 1;
      `,
      [offering_id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'No data found for this offering ID' });
    }

    const data = rows[0];

    // Optional: fetch saved edits (if the faculty saved updates)
    const [savedData] = await dbPool.query(
      `SELECT * FROM course_cover_page WHERE course_id = ? AND faculty_id = ? LIMIT 1`,
      [data.course_id, data.facultyId]
    );

    const coverPage = savedData.length ? savedData[0] : data;

    res.json({
      courseName: coverPage.courseName || data.courseName,
      courseCode: coverPage.courseCode || data.courseCode,
      nbaCode: coverPage.nbaCode || data.nbaCode,
      semesterSection: coverPage.semesterSection || data.semesterSection,
      academicYear: coverPage.academicYear || data.academicYear,
      courseCoordinator: coverPage.courseCoordinator || data.courseCoordinator,
      coordinatorBatches: coverPage.coordinatorBatches || '—',
      courseInstructor: coverPage.courseInstructor || data.courseInstructor,
      instructorBatches: coverPage.instructorBatches || '—',
    });
  } catch (err) {
    console.error('Error fetching Lab Course Cover Page:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Save or update Lab Course Cover Page
const saveLabCourseCoverPage = async (req, res) => {
  try {
    const { offering_id } = req.params;
    const {
      courseName,
      courseCode,
      nbaCode,
      semesterSection,
      academicYear,
      courseCoordinator,
      coordinatorBatches,
      courseInstructor,
      instructorBatches,
      facultyId,
    } = req.body;

    if (!offering_id || !facultyId) {
      return res.status(400).json({ message: 'Offering ID and faculty ID are required' });
    }

    // Get course_id from offering_id
    const [[courseData]] = await dbPool.query(
      `SELECT course_id FROM course_offering WHERE offering_id = ? LIMIT 1`,
      [offering_id]
    );

    if (!courseData) {
      return res.status(404).json({ message: 'Invalid offering ID' });
    }

    const { course_id } = courseData;

    // Upsert into course_cover_page
    await dbPool.query(
      `
      INSERT INTO course_cover_page (
        faculty_id, course_id, courseName, courseCode, nbaCode,
        semesterSection, academicYear, courseCoordinator, coordinatorBatches,
        courseInstructor, instructorBatches
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        courseName = VALUES(courseName),
        courseCode = VALUES(courseCode),
        nbaCode = VALUES(nbaCode),
        semesterSection = VALUES(semesterSection),
        academicYear = VALUES(academicYear),
        courseCoordinator = VALUES(courseCoordinator),
        coordinatorBatches = VALUES(coordinatorBatches),
        courseInstructor = VALUES(courseInstructor),
        instructorBatches = VALUES(instructorBatches)
      `,
      [
        facultyId,
        course_id,
        courseName,
        courseCode,
        nbaCode,
        semesterSection,
        academicYear,
        courseCoordinator,
        coordinatorBatches,
        courseInstructor,
        instructorBatches,
      ]
    );

    res.json({ message: 'Lab Course Cover Page saved successfully' });
  } catch (err) {
    console.error('Error saving Lab Course Cover Page:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getLabCourseCoverPage, saveLabCourseCoverPage };
