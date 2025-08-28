// const { dbPool } = require("../config/db");

// exports.addCourse = async (req, res) => {
//   const { name, credits, code, nba } = req.body;
//   try {
//     const [result] = await dbPool.query(
//       "INSERT INTO course (name, credits, code, nba) VALUES (?, ?, ?, ?)",
//       [name, credits, code, nba]
//     );
//     res.json({ course_id: result.insertId });
//   } catch (err) {
//     console.error("Add course error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// exports.getCourses = async (req, res) => {
//   try {
//     const [rows] = await dbPool.query("SELECT * FROM course");
//     res.json(rows);
//   } catch (err) {
//     console.error("Fetch courses error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };



const courseModel = require("../models/courseModel");

const getCourses = async (req, res) => {
  try {
    const courses = await courseModel.getAllCourses();
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

const createCourse = async (req, res) => {
  try {
    const newCourse = await courseModel.addCourse(req.body);
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Failed to create course" });
  }
};

const updateCourse = async (req, res) => {
  try {
    const updatedCourse = await courseModel.updateCourse(req.params.id, req.body);
    res.json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Failed to update course" });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const result = await courseModel.deleteCourse(req.params.id);
    res.json(result);
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Failed to delete course" });
  }
};

const { dbPool } = require('../config/db'); // ✅ Destructure only db

const getCourseTypes = async (req, res) => {
  try {
    const [rows] = await dbPool.query(`SELECT * FROM course_type`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch course types' });
  }
};

const addCourseType = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  try {
    const [result] = await dbPool.query(`INSERT INTO course_type (name) VALUES (?)`, [name]);
    res.json({ message: 'Course type added', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add course type' });
  }
};



// Fetch courses for given batch + sem (via schema)
const getCoursesByBatchSem = async (req, res) => {
  const { batchId, semId } = req.params;
  try {
    const [rows] = await dbPool.query(`
      SELECT c.course_id, c.code, c.name
      FROM batch b
      JOIN schema_course sc ON b.schema_id = sc.schema_id
      JOIN course c ON sc.course_id = c.course_id
      JOIN sem s ON sc.sem = s.sem
      WHERE b.batch_id = ? AND s.sem_id = ?
    `, [batchId, semId]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching courses", details: err });
  }
};


module.exports = {
  getCoursesByBatchSem,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
    getCourseTypes, 
    addCourseType,
}


