const { dbPool } = require('../config/db');

// Get courses by batch + sem
const getCoursesByBatchSem = async (req, res) => {
  const { batchId, semId } = req.params;

  try {
    // First check if batch exists
    const [batchRows] = await dbPool.query(
      "SELECT * FROM batch WHERE batch_id = ?",
      [batchId]
    );
    if (batchRows.length === 0) {
      return res.status(404).json({ error: "Batch not found" });
    }

    const schemaId = batchRows[0].schema_id;
    if (!schemaId) {
      return res.json([]); // no schema → no courses
    }

    // Get courses for this schema + sem
    const [courses] = await dbPool.query(
      `SELECT c.course_id, c.code, c.name, sc.sem_id
       FROM schema_course sc
       JOIN course c ON sc.course_id = c.course_id
       WHERE sc.schema_id = ? AND sc.sem_id = ?`,
      [schemaId, semId]
    );

    res.json(courses);
  } catch (err) {
    console.error("Error fetching courses by batch/sem:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getCoursesByBatchSem };
