// // const { dbPool } = require('../config/db');

// // // ==========================
// // // Get Lab Course Closure by offering_id
// // // ==========================
// // const getLabCourseClosure = async (req, res) => {
// //   try {
// //     const { offering_id } = req.params;
// //     if (!offering_id) {
// //       return res.status(400).json({ message: 'Offering ID is required' });
// //     }

// //     // Fetch basic course and faculty info
// //     const [rows] = await dbPool.query(
// //       `
// //       SELECT 
// //         c.course_id,
// //         c.name AS courseName,
// //         c.code AS courseCode,
// //         c.nba AS nbaCode,
// //         CONCAT('Sem ', s.sem, ' - ', sec.name) AS semesterSection,
// //         CONCAT(b.start_year, '-', b.end_year) AS academicYear,
// //         f.name AS facultyName,
// //         f.faculty_id AS facultyId
// //       FROM course_offering co
// //       JOIN course c ON c.course_id = co.course_id
// //       JOIN sem s ON s.sem_id = co.sem_id
// //       JOIN batch b ON b.batch_id = co.batch_id
// //       LEFT JOIN course_teaching_assignment cta ON cta.offering_id = co.offering_id
// //       LEFT JOIN faculty f ON f.faculty_id = cta.faculty_id
// //       LEFT JOIN section sec ON sec.section_id = cta.section_id
// //       WHERE co.offering_id = ?
// //       LIMIT 1
// //       `,
// //       [offering_id]
// //     );

// //     if (!rows.length) {
// //       return res.status(404).json({ message: 'No data found for this offering ID' });
// //     }

// //     const baseData = rows[0];

// //     // Fetch saved closure details if available
// //     const [closureRows] = await dbPool.query(
// //       `SELECT corrective_prev, initiatives_current, corrective_next 
// //        FROM lab_course_closure 
// //        WHERE offering_id = ? AND faculty_id = ? 
// //        LIMIT 1`,
// //       [offering_id, baseData.facultyId]
// //     );

// //     const saved = closureRows.length ? closureRows[0] : {};

// //     res.json({
// //       facultyName: baseData.facultyName,
// //       courseName: baseData.courseName,
// //       courseCode: baseData.courseCode,
// //       nbaCode: baseData.nbaCode,
// //       semesterSection: baseData.semesterSection,
// //       academicYear: baseData.academicYear,
// //       facultyId: baseData.facultyId,
// //       course_id: baseData.course_id,
// //       a: saved.corrective_prev || '',
// //       b: saved.initiatives_current || '',
// //       c: saved.corrective_next || ''
// //     });
// //   } catch (err) {
// //     console.error('Error fetching lab course closure:', err);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // };

// // // ==========================
// // // Save or Update Lab Course Closure
// // // ==========================
// // const saveLabCourseClosure = async (req, res) => {
// //   try {
// //     const { offering_id } = req.params;
// //     const { facultyId, course_id, a, b, c } = req.body;

// //     if (!offering_id || !facultyId || !course_id) {
// //       return res.status(400).json({ message: 'Offering ID, Faculty ID, and Course ID are required' });
// //     }

// //     // Upsert logic
// //     await dbPool.query(
// //       `
// //       INSERT INTO lab_course_closure (
// //         offering_id, faculty_id, course_id, corrective_prev, initiatives_current, corrective_next
// //       )
// //       VALUES (?, ?, ?, ?, ?, ?)
// //       ON DUPLICATE KEY UPDATE
// //         corrective_prev = VALUES(corrective_prev),
// //         initiatives_current = VALUES(initiatives_current),
// //         corrective_next = VALUES(corrective_next)
// //       `,
// //       [offering_id, facultyId, course_id, a, b, c]
// //     );

// //     res.json({ message: 'Lab course closure saved successfully' });
// //   } catch (err) {
// //     console.error('Error saving lab course closure:', err);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // };

// // module.exports = {
// //   getLabCourseClosure,
// //   saveLabCourseClosure
// // };


// const { dbPool } = require('../config/db');

// const getLabCourseClosure = async (req, res) => {
//   try {
//     const { offering_id } = req.params;
//     if (!offering_id) {
//       return res.status(400).json({ message: 'Offering ID is required' });
//     }

//     const [rows] = await dbPool.query(
//       `
//       SELECT 
//         c.course_id,
//         c.name AS courseName,
//         c.code AS courseCode,
//         c.nba AS nbaCode,
//         CONCAT('Sem ', s.sem, ' - ', sec.name) AS semesterSection,
//         CONCAT(b.start_year, '-', b.end_year) AS academicYear,
//         f.name AS facultyName,
//         f.faculty_id AS facultyId
//       FROM course_offering co
//       JOIN course c ON c.course_id = co.course_id
//       JOIN sem s ON s.sem_id = co.sem_id
//       JOIN batch b ON b.batch_id = co.batch_id
//       LEFT JOIN course_teaching_assignment cta ON cta.offering_id = co.offering_id
//       LEFT JOIN faculty f ON f.faculty_id = cta.faculty_id
//       LEFT JOIN section sec ON sec.section_id = cta.section_id
//       WHERE co.offering_id = ?
//       LIMIT 1
//       `,
//       [offering_id]
//     );

//     if (!rows.length) {
//       return res.status(404).json({ message: 'No data found for this offering ID' });
//     }

//     const baseData = rows[0];

//     const [closureRows] = await dbPool.query(
//       `SELECT corrective_prev, initiatives_current, corrective_next 
//        FROM lab_course_closure 
//        WHERE offering_id = ? AND faculty_id = ? 
//        LIMIT 1`,
//       [offering_id, baseData.facultyId]
//     );

//     const saved = closureRows.length ? closureRows[0] : {};

//     res.json({
//       facultyName: baseData.facultyName,
//       courseName: baseData.courseName,
//       courseCode: baseData.courseCode,
//       nbaCode: baseData.nbaCode,
//       semesterSection: baseData.semesterSection,
//       academicYear: baseData.academicYear,
//       facultyId: baseData.facultyId,
//       course_id: baseData.course_id,
//       a: saved.corrective_prev || '',
//       b: saved.initiatives_current || '',
//       c: saved.corrective_next || ''
//     });
//   } catch (err) {
//     console.error('Error fetching lab course closure:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const saveLabCourseClosure = async (req, res) => {
//   try {
//     const { offering_id } = req.params;
//     const { facultyId, course_id, a, b, c } = req.body;

//     if (!offering_id || !facultyId || !course_id) {
//       return res.status(400).json({ message: 'Offering ID, Faculty ID, and Course ID are required' });
//     }

//     await dbPool.query(
//       `
//       INSERT INTO lab_course_closure (
//         offering_id, faculty_id, course_id, corrective_prev, initiatives_current, corrective_next
//       )
//       VALUES (?, ?, ?, ?, ?, ?)
//       ON DUPLICATE KEY UPDATE
//         corrective_prev = VALUES(corrective_prev),
//         initiatives_current = VALUES(initiatives_current),
//         corrective_next = VALUES(corrective_next)
//       `,
//       [offering_id, facultyId, course_id, a, b, c]
//     );

//     res.json({ message: 'Lab course closure saved successfully' });
//   } catch (err) {
//     console.error('Error saving lab course closure:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = {
//   getLabCourseClosure,
//   saveLabCourseClosure
// };




const { dbPool } = require('../config/db');

const getLabCourseClosure = async (req, res) => {
  try {
    const { offering_id } = req.params;
    if (!offering_id) {
      return res.status(400).json({ message: 'Offering ID is required' });
    }

    const [rows] = await dbPool.query(
      `
      SELECT 
        c.course_id,
        c.name AS courseName,
        c.code AS courseCode,
        c.nba AS nbaCode,
        CONCAT('Sem ', s.sem, ' - ', sec.name) AS semesterSection,
        CONCAT(b.start_year, '-', b.end_year) AS academicYear,
        f.name AS facultyName,
        f.faculty_id AS facultyId
      FROM course_offering co
      JOIN course c ON c.course_id = co.course_id
      JOIN sem s ON s.sem_id = co.sem_id
      JOIN batch b ON b.batch_id = co.batch_id
      LEFT JOIN course_teaching_assignment cta ON cta.offering_id = co.offering_id
      LEFT JOIN faculty f ON f.faculty_id = cta.faculty_id
      LEFT JOIN section sec ON sec.section_id = cta.section_id
      WHERE co.offering_id = ?
      LIMIT 1
      `,
      [offering_id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'No data found for this offering ID' });
    }

    const baseData = rows[0];

    const [closureRows] = await dbPool.query(
      `SELECT corrective_prev, initiatives_current, corrective_next 
       FROM lab_course_closure 
       WHERE offering_id = ? AND faculty_id = ? 
       LIMIT 1`,
      [offering_id, baseData.facultyId]
    );

    const saved = closureRows.length ? closureRows[0] : {};

    res.json({
      facultyName: baseData.facultyName,
      courseName: baseData.courseName,
      courseCode: baseData.courseCode,
      nbaCode: baseData.nbaCode,
      semesterSection: baseData.semesterSection,
      academicYear: baseData.academicYear,
      facultyId: baseData.facultyId,
      course_id: baseData.course_id,
      a: saved.corrective_prev || '',
      b: saved.initiatives_current || '',
      c: saved.corrective_next || ''
    });
  } catch (err) {
    console.error('Error fetching lab course closure:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const saveLabCourseClosure = async (req, res) => {
  try {
    const { offering_id } = req.params;
    const { facultyId, course_id, a, b, c } = req.body;

    if (!offering_id || !facultyId || !course_id) {
      return res.status(400).json({ message: 'Offering ID, Faculty ID, and Course ID are required' });
    }

    await dbPool.query(
      `
      INSERT INTO lab_course_closure (
        offering_id, faculty_id, course_id, corrective_prev, initiatives_current, corrective_next
      )
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        corrective_prev = VALUES(corrective_prev),
        initiatives_current = VALUES(initiatives_current),
        corrective_next = VALUES(corrective_next)
      `,
      [offering_id, facultyId, course_id, a, b, c]
    );

    res.json({ message: 'Lab course closure saved successfully' });
  } catch (err) {
    console.error('Error saving lab course closure:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getLabCourseClosure,
  saveLabCourseClosure
};


