// const { dbPool } = require("../config/db");

// exports.addBatch = async (req, res) => {
//   const { name, start_year, end_year, program_id, schema_id, sem } = req.body;
//   try {
//     const [result] = await dbPool.query(
//       "INSERT INTO batch (name, start_year, end_year, program_id, schema_id, sem) VALUES (?, ?, ?, ?, ?, ?)",
//       [name, start_year, end_year, program_id, schema_id, sem]
//     );
//     res.json({ batch_id: result.insertId });
//   } catch (err) {
//     console.error("Add batch error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// exports.getLatestBatch = async (req, res) => {
//   try {
//     const [rows] = await dbPool.query(
//       "SELECT batch_id FROM batch WHERE schema_id IS NULL ORDER BY batch_id DESC LIMIT 1"
//     );
//     res.json(rows[0] || {});
//   } catch (err) {
//     console.error("Fetch latest batch error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };





// controllers/batchController.js
const { dbPool } = require('../config/db');

exports.getAllBatches = async (req, res) => {
  try {
    const [rows] = await dbPool.query(`
      SELECT b.*, p.name AS program_name
      FROM BATCH b
      JOIN PROGRAM p ON b.program_id = p.program_id
      ORDER BY b.start_year DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching batches:', err);
    res.status(500).json({ error: 'Failed to fetch batches' });
  }
};

exports.getBatchById = async (req, res) => {
  try {
    const { batchId } = req.params;
    const [rows] = await dbPool.query(`SELECT * FROM BATCH WHERE batch_id = ?`, [batchId]);
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch batch' });
  }
};

exports.createBatch = async (req, res) => {
  try {
    const { name, start_year, end_year, program_id, schema_id} = req.body;
    const [result] = await dbPool.query(
      `INSERT INTO BATCH (name, start_year, end_year, program_id, schema_id) VALUES (?, ?, ?, ?, ?)`,
      [name, start_year, end_year, program_id, schema_id]
    );
    res.json({ message: 'Batch created', batch_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create batch' });
  }
};

exports.getLatestBatch = async (req, res) => {
  try {
    const [rows] = await dbPool.query(`SELECT * FROM BATCH ORDER BY batch_id DESC LIMIT 1`);
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch latest batch' });
  }
};


exports.getCoursesByBatch = async (req, res) => {
  const batchId = req.params.batchId;
  try {
    const [batch] = await dbPool.query('SELECT * FROM batch WHERE batch_id = ?', [batchId]);
    if (batch.length === 0) return res.status(404).json({ error: 'Batch not found' });

    const schemaId = batch[0].schema_id;
    if (!schemaId) return res.json([]);

    const [courses] = await dbPool.query(
      `SELECT c.course_id, c.code, c.name 
       FROM schema_course sc 
       JOIN course c ON sc.course_id = c.course_id 
       WHERE sc.schema_id = ?`,
      [schemaId]
    );

    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

