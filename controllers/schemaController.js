const { dbPool } = require("../config/db");

// Create a schema
exports.createSchema = async (req, res) => {
  try {
    const { name, program_id } = req.body;
    if (!name || !program_id) {
      return res.status(400).json({ message: "Schema name and program_id required" });
    }

    const [result] = await dbPool.query(
      "INSERT INTO schema_table (name, program_id) VALUES (?, ?)",
      [name, program_id]
    );

    res.status(201).json({ schema_id: result.insertId, name, program_id });
  } catch (err) {
    console.error("Error creating schema:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all schemas for a program
exports.getSchemasByProgram = async (req, res) => {
 const { program_id } = req.params;
  try {
    const [rows] = await dbPool.query(
      "SELECT * FROM schema_table WHERE program_id = ?",
      [program_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

// Add courses to schema (semester-wise)
exports.addCoursesToSchema = async (req, res) => {
  try {
    const payload = req.body; // array of {schema_id, sem, course_id}
    if (!Array.isArray(payload) || payload.length === 0) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const values = payload.map((p) => [p.schema_id, p.course_id, p.sem]);
    await dbPool.query(
      "INSERT IGNORE INTO schema_course (schema_id, course_id, sem) VALUES ?",
      [values]
    );

    res.status(201).json({ message: "Courses added successfully" });
  } catch (err) {
    console.error("Error adding courses:", err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Course already added to this schema" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Get courses in a schema
exports.getSchemaCourses = async (req, res) => { 
  try {
    const { schemaId } = req.params;
    const [rows] = await dbPool.query(
      `SELECT c.course_id, c.name, c.code, c.credits, c.nba, ct.name AS course_type, sc.sem
       FROM schema_course sc
       JOIN course c ON sc.course_id = c.course_id
       LEFT JOIN course_type ct ON c.course_type_id = ct.course_type_id
       WHERE sc.schema_id = ?`,
      [schemaId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching schema courses:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.deleteCourseFromSchema = async (req, res) => {
  try {
    const { schemaId, courseId } = req.params;

    await dbPool.query(
      "DELETE FROM schema_course WHERE schema_id = ? AND course_id = ?",
      [schemaId, courseId]
    );

    res.status(200).json({ message: "Course removed from schema" });
  } catch (err) {
    console.error("Error deleting course from schema:", err);
    res.status(500).json({ message: "Server error" });
  }
};

