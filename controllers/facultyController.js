const facultyModel = require('../models/facultyModel');
const bcrypt = require('bcryptjs');



const { dbPool } = require('../config/db');


// controllers/facultyController.js


const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Select the role from the faculty table
    const [rows] = await dbPool.query('SELECT faculty_id, name, email, password, role FROM FACULTY WHERE email = ?', [email]);
    const faculty = rows[0];

    if (!faculty) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, faculty.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create and sign a JWT token
    const token = jwt.sign(
      { id: faculty.faculty_id, role: faculty.role }, // Use the role from the database
      'YOUR_SECRET_KEY',
      { expiresIn: '1h' }
    );
    
    // Respond with success message and token
    res.status(200).json({
      message: 'Login successful',
      token,
      faculty_id: faculty.faculty_id,
      email: faculty.email,
      role: faculty.role, // Include the role from the database in the response
    });
  } catch (error) {
    console.error('Faculty login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};


// Create a new faculty member (auto-increment ID)
exports.createFaculty = async (req, res) => {
  try {
    const { name, email, password, dept_id, role } = req.body;

    if (!name || !email || !password || !dept_id || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await dbPool.execute(
      `INSERT INTO FACULTY (name, email, password, dept_id, role)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, dept_id, role]
    );

    // Return inserted faculty ID
    res.status(201).json({ message: 'Faculty created', faculty_id: result.insertId });
  } catch (err) {
    console.error('Error creating faculty:', err);
    res.status(500).json({ error: 'Failed to create faculty' });
  }
};


exports.getAllFaculty = async (req, res) => {
  try {
    const facultyList = await facultyModel.getAllFaculty();
    res.json(facultyList);
  } catch (error) {
    console.error('Fetch Faculty Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getFacultyById = async (req, res) => {
  try {
    const faculty = await facultyModel.getFacultyById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    res.json(faculty);
  } catch (error) {
    console.error('Get Faculty By ID Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteFaculty = async (req, res) => {
  try {
    await facultyModel.deleteFaculty(req.params.id);
    res.json({ message: 'Faculty deleted successfully' });
  } catch (error) {
    console.error('Delete Faculty Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getFacultyDept = async (req, res) => {
  const facultyId = req.params.id;
  try {
    const [rows] = await dbPool.query(
      `SELECT d.dept_id, d.name AS dept_name, d.code AS dept_code
       FROM FACULTY f
       JOIN dept d ON f.dept_id = d.dept_id
       WHERE f.faculty_id = ?`,
      [facultyId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Faculty or department not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching dept for faculty:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// ✅ Get programs for faculty’s dept
exports.getFacultyPrograms = async (req, res) => {
  const facultyId = req.params.id;
  try {
    const [rows] = await dbPool.query(
      `SELECT p.program_id, p.name AS program_name, p.code AS program_code
       FROM FACULTY f
       JOIN dept d ON f.dept_id = d.dept_id
       JOIN PROGRAM p ON d.dept_id = p.dept_id
       WHERE f.faculty_id = ?`,
      [facultyId]
    );

    res.json(rows);
  } catch (err) {
    console.error('Error fetching programs for faculty:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get department info by faculty_id
exports.getDeptByFacultyId = async (req, res) => {
  const { facultyId } = req.params;

  try {
    const [rows] = await dbPool.query(
      `SELECT d.dept_id, d.name
       FROM FACULTY f
       JOIN dept d ON f.dept_id = d.dept_id
       WHERE f.faculty_id = ?`,
      [facultyId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Faculty or Department not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching department:", err);
    res.status(500).json({ error: "Database error" });
  }
};


// ✅ Get all faculty by department ID
exports.getFacultyByDeptId = async (req, res) => {
  const { deptId } = req.params;

  try {
    const [rows] = await dbPool.query(
      `SELECT faculty_id, name, email, role 
       FROM FACULTY 
       WHERE dept_id = ?`,
      [deptId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No faculty found for this department" });
    }

    res.json(rows);
  } catch (err) {
    console.error("Error fetching faculty by dept_id:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// module.exports = {
//   getDeptByFacultyId: require("./facultyController").getDeptByFacultyId, // keep old one
//   getFacultyByDeptId,
// };

// module.exports = {
//   getDeptByFacultyId,
// };