// const { dbPool } = require("../config/db");
// const bcrypt = require("bcryptjs");

// exports.addStudent = async (req, res) => {
//   const { name, section_id, email, password, start_year, end_year } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const [result] = await dbPool.query(
//       "INSERT INTO student (name, section_id, email, password, start_year, end_year) VALUES (?, ?, ?, ?, ?, ?)",
//       [name, section_id, email, hashedPassword, start_year, end_year]
//     );
//     res.json({ student_id: result.insertId });
//   } catch (err) {
//     console.error("Add student error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };



// controllers/studentController.js
const { dbPool } = require('../config/db');

exports.getStudentsBySection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const [rows] = await dbPool.query(
      `SELECT student_id, name, email, start_year, end_year , usn
       FROM STUDENT WHERE section_id = ? ORDER BY name ASC`,
      [sectionId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

exports.addStudent = async (req, res) => {
  try {
    const { name, email, password, section_id, start_year, end_year, usn } = req.body;
    const [result] = await dbPool.query(
      `INSERT INTO STUDENT (name, email, password, section_id, start_year, end_year, usn)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, password, section_id, start_year, end_year, usn]
    );
    res.json({ message: 'Student added', student_id: result.insertId });
  } catch (err) {
    console.error("Add student error:", err);  // Log error for debugging
    res.status(500).json({ error: 'Failed to add student' });
  }
};



// GET students by offering_id
exports.getStudentsByOffering = async (req, res) => {
  const { offering_id } = req.params;

  try {
    const [rows] = await dbPool.query(
      `
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
      FROM course_offering co
      JOIN batch b ON co.batch_id = b.batch_id
      JOIN section sec ON sec.batch_id = b.batch_id
      JOIN student s ON s.section_id = sec.section_id
      WHERE co.offering_id = ?;
      `,
      [offering_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No students found for this offering ID' });
    }

    res.json(rows);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Server error fetching students' });
  }
};

// module.exports = { getStudentsByOffering };

