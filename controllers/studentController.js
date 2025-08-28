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


