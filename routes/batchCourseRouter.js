const express = require("express");
const router = express.Router();
const { getCoursesByBatchSem } = require("../controllers/batchCourseController");

// GET /api/batch/:batchId/sem/:semId/courses
router.get("/batch/:batchId/sem/:semId/courses", getCoursesByBatchSem);

const { dbPool } = require('../config/db');

// Get sem list for a specific batch from batch_sem mapping
const getSemestersByBatch = async (req, res) => {
  const { batchId } = req.params;
  try {
    const [rows] = await dbPool.query(
      `SELECT s.sem_id, s.sem
       FROM batchsem bs
       JOIN sem s ON bs.sem_id = s.sem_id
       WHERE bs.batch_id = ?
       ORDER BY s.sem`,
      [batchId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching semesters for batch:', err);
    res.status(500).json({ error: 'Failed to fetch semesters for batch' });
  }
};

module.exports = {
  getSemestersByBatch,
};


module.exports = router;
