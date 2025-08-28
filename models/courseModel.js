const { dbPool } = require("../config/db");

// Get all courses
const getAllCourses = async () => {
  const [rows] = await dbPool.query("SELECT * FROM course");
  return rows;
};

// Add new course
const addCourse = async (course) => {
  const { name, credits, code, nba ,course_type_id} = course;
  const [result] = await dbPool.query(
    "INSERT INTO course (name, credits, code, nba ,course_type_id) VALUES (?, ?, ?, ? ,?)",
    [name, credits, code, nba ,course_type_id]
  );
  return { course_id: result.insertId, ...course };
};

// Update course
const updateCourse = async (id, course) => {
  const { name, credits, code, nba ,course_type_id} = course;
  await dbPool.query(
    "UPDATE course SET name = ?, credits = ?, code = ?, nba = ? ,course_type_id=? WHERE course_id = ?",
    [name, credits, code, nba, course_type_id ,id]
  );
  return { course_id: id, ...course };
};

// Delete course
const deleteCourse = async (id) => {
  await dbPool.query("DELETE FROM course WHERE course_id = ?", [id]);
  return { message: "Course deleted successfully" };
};

module.exports = {
  getAllCourses,
  addCourse,
  updateCourse,
  deleteCourse,
};
