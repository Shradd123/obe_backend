const { dbPool } = require('../config/db');

// Get courses for a given batch + semester
const getCoursesByBatchSem = async (req, res) => {
  const { batchId, semId } = req.params;

  try {
    // 1. Verify batch exists & get schema_id
    const [batchRows] = await dbPool.query(
      "SELECT schema_id FROM batch WHERE batch_id = ?",
      [batchId]
    );

    if (batchRows.length === 0) {
      return res.status(404).json({ error: "Batch not found" });
    }

    const schemaId = batchRows[0].schema_id;
    if (!schemaId) {
      return res.json([]); // if schema not assigned, return empty
    }

    // 2. Get courses for this schema + semester
    const [courses] = await dbPool.query(
      `SELECT c.course_id, c.code, c.name
       FROM schema_course sc
       JOIN course c ON sc.course_id = c.course_id
       WHERE sc.schema_id = ? AND sc.sem = ?`,
      [schemaId, semId]
    );

    res.json(courses);
  } catch (err) {
    console.error("Error fetching courses by batch/sem:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getCoursesByBatchSem };
