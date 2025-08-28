// // controller/batchSemController.js
// const { dbPool } = require('../config/db');

// // // Get all batch_sem records
// // const getAllBatchSem = async (req, res) => {
// //   try {
// //     const [rows] = await dbPool.query(
// //       `SELECT bs.batch_sem_id, b.name AS batch_name, s.sem AS semester
// //        FROM batchsem bs
// //        JOIN batch b ON bs.batch_id = b.batch_id
// //        JOIN sem s ON bs.sem_id = s.sem_id`
// //     );
// //     res.json(rows);
// //   } catch (err) {
// //     console.error("Error fetching batchsem:", err);
// //     res.status(500).json({ error: "Internal server error" });
// //   }
// // };

// // // Create a new batch_sem record
// // const addBatchSem = async (req, res) => {
// //   const { batch_id, sem_id } = req.body;
// //   if (!batch_id || !sem_id) {
// //     return res.status(400).json({ error: "batch_id and sem_id are required" });
// //   }
// //   try {
// //     const [result] = await dbPool.query(
// //       "INSERT INTO batchsem (batch_id, sem_id) VALUES (?, ?)",
// //       [batch_id, sem_id]
// //     );
// //     res.status(201).json({ batch_sem_id: result.insertId, batch_id, sem_id });
// //   } catch (err) {
// //     console.error("Error adding batch_sem:", err);
// //     res.status(500).json({ error: "Internal server error" });
// //   }
// // };

// // Delete batch_sem by ID
// const deleteBatchSem = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const [result] = await dbPool.query(
//       "DELETE FROM batchsem WHERE batchsem_id = ?",
//       [id]
//     );
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: "batch_sem not found" });
//     }
//     res.json({ message: "batchsem deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting batchsem:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };



// // Get all batch-sem mappings with batch + sem info
// const getBatchSems = async (req, res) => {
//   try {
//     const [rows] = await dbPool.query(`
//       SELECT 
//         bs.batch_sem_id, 
//         bs.batch_id, 
//         bs.sem_id, 
//         b.name AS batch_name, 
//         s.sem AS semester
//       FROM batchsem bs
//       JOIN batch b ON bs.batch_id = b.batch_id
//       JOIN sem s ON bs.sem_id = s.sem_id
//       ORDER BY b.batch_id, s.sem
//     `);
//     res.json(rows);
//   } catch (err) {
//     console.error("Error fetching batchsems:", err);
//     res.status(500).json({ error: "Failed to fetch batchsems" });
//   }
// };

// // Assign semester to batch
// const assignSem = async (req, res) => {
//   const { batch_id, sem_id } = req.body;
//   try {
//     await dbPool.query(
//       "INSERT INTO batchsem (batch_id, sem_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE sem_id=sem_id",
//       [batch_id, sem_id]
//     );
//     res.json({ message: "Semester assigned successfully" });
//   } catch (err) {
//     console.error("Error assigning semester:", err);
//     res.status(500).json({ error: "Failed to assign semester" });
//   }
// };


// module.exports = {
//     getBatchSems,
//     assignSem,
// //   getAllBatchSem,
// //   addBatchSem,
//   deleteBatchSem,
// };



const { dbPool } = require('../config/db');

// Get all batch-sem mappings with batch + sem info
const getBatchSems = async (req, res) => {
  try {
    const [rows] = await dbPool.query(`
      SELECT 
        bs.batch_sem_id, 
        bs.batch_id, 
        bs.sem_id, 
        b.name AS batch_name, 
        s.sem AS semester
      FROM batchsem bs
      JOIN batch b ON bs.batch_id = b.batch_id
      JOIN sem s ON bs.sem_id = s.sem_id
      ORDER BY b.batch_id, s.sem
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching batchsems:", err);
    res.status(500).json({ error: "Failed to fetch batchsems" });
  }
};

// Assign semester to batch
const assignSem = async (req, res) => {
  const { batch_id, sem_id } = req.body;
  if (!batch_id || !sem_id) {
    return res.status(400).json({ error: "batch_id and sem_id are required" });
  }

  try {
    await dbPool.query(
      `INSERT INTO batchsem (batch_id, sem_id) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE sem_id = sem_id`,
      [batch_id, sem_id]
    );
    res.json({ message: "Semester assigned successfully" });
  } catch (err) {
    console.error("Error assigning semester:", err);
    res.status(500).json({ error: "Failed to assign semester" });
  }
};

// Delete batch_sem by ID
const deleteBatchSem = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await dbPool.query(
      "DELETE FROM batchsem WHERE batch_sem_id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "batch_sem not found" });
    }
    res.json({ message: "batch_sem deleted successfully" });
  } catch (err) {
    console.error("Error deleting batchsem:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};





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
  getBatchSems,
  assignSem,
  deleteBatchSem,
  getSemestersByBatch,
};

