const { dbPool } = require('../config/db');

// ---------------------- Get students by section ----------------------
const getStudentsBySection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const [rows] = await dbPool.query(
      `SELECT student_id, name, email, start_year, end_year, usn
       FROM STUDENT WHERE section_id = ? ORDER BY name ASC`,
      [sectionId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

// ---------------------- Add new student ----------------------
const addStudent = async (req, res) => {
  try {
    const { name, email, password, section_id, start_year, end_year, usn } = req.body;
    const [result] = await dbPool.query(
      `INSERT INTO STUDENT (name, email, password, section_id, start_year, end_year, usn)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, password, section_id, start_year, end_year, usn]
    );
    res.json({ message: 'Student added', student_id: result.insertId });
  } catch (err) {
    console.error('Add student error:', err);
    res.status(500).json({ error: 'Failed to add student' });
  }
};

// ---------------------- Get students by faculty & offering ----------------------
const getStudentsByOffering = async (req, res) => {
  try {
    const { faculty_id, offering_id } = req.query;


    if (!faculty_id || !offering_id) {
      return res.status(400).json({
        message: 'Missing required query parameters: faculty_id and offering_id',
      });
    }

    const query = `
      SELECT
        s.student_id,
        s.name AS student_name,
        s.usn,
        s.email,
        sec.section_id,
        sec.name AS section_name,
        b.batch_id,
        b.name AS batch_name,
        co.offering_id
      FROM student s
      JOIN section sec ON s.section_id = sec.section_id
      JOIN course_teaching_assignment cta ON cta.section_id = sec.section_id
      JOIN course_offering co ON cta.offering_id = co.offering_id
      JOIN batch b ON co.batch_id = b.batch_id
      WHERE co.offering_id = ? 
        AND cta.faculty_id = ?;
    `;

    const [rows] = await dbPool.query(query, [offering_id, faculty_id]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'No students found for the given faculty and offering',
      });
    }

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({
      message: 'Internal server error while fetching students',
      error: error.message,
    });
  }
};

// ✅ Export all controller functions properly
module.exports = {
  getStudentsBySection,
  addStudent,
  getStudentsByOffering,
};
