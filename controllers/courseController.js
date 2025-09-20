const courseModel = require("../models/courseModel");
const { dbPool } = require('../config/db');

// Get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await courseModel.getAllCourses();
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

// Create new course
const createCourse = async (req, res) => {
  try {
    const newCourse = await courseModel.addCourse(req.body);
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Failed to create course" });
  }
};

// Update existing course
const updateCourse = async (req, res) => {
  try {
    const updatedCourse = await courseModel.updateCourse(req.params.id, req.body);
    res.json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Failed to update course" });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  try {
    const result = await courseModel.deleteCourse(req.params.id);
    res.json(result);
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Failed to delete course" });
  }
};

// Get all course types
const getCourseTypes = async (req, res) => {
  try {
    const [rows] = await dbPool.query(`SELECT * FROM course_type`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch course types' });
  }
};

// Add a new course type
const addCourseType = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    const [result] = await dbPool.query(
      `INSERT INTO course_type (name) VALUES (?)`, 
      [name]
    );
    res.json({ message: 'Course type added', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add course type' });
  }
};

module.exports = {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseTypes, 
  addCourseType,
};
