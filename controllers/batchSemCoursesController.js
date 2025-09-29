const { dbPool } = require('../config/db');

// Get courses for a given batch + semester
const getCoursesByBatchSem = async (req, res) => {
  const { batchId, semId } = req.params;

  try {
    // 1. Verify batch exists
    const [batchRows] = await dbPool.query(
      "SELECT batch_id FROM batch WHERE batch_id = ?",
      [batchId]
    );

    if (batchRows.length === 0) {
      return res.status(404).json({ error: "Batch not found" });
    }

    // 2. Get courses for this batch + semester with course type
    const [courses] = await dbPool.query(
      `SELECT 
          co.offering_id,         
          c.code, 
          c.name, 
          ct.name AS courseType
       FROM course_offering co
       JOIN course c 
            ON co.course_id = c.course_id
       LEFT JOIN course_type ct 
            ON c.course_type_id = ct.course_type_id
       WHERE co.batch_id = ?   
         AND co.sem_id = ?;`,
      [batchId, semId]   // ✅ fixed
    );

    res.json(courses);
  } catch (err) {
    console.error("Error fetching courses by batch/sem:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getCoursesByBatchSem };
