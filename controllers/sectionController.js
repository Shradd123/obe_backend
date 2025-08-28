// const { dbPool } = require("../config/db");

// exports.addSections = async (req, res) => {
//   const { batch_id, program_id, sections } = req.body;
//   try {
//     const sectionIds = [];
//     for (const name of sections) {
//       const [result] = await dbPool.query(
//         "INSERT INTO section (name, batch_id, program_id) VALUES (?, ?, ?)",
//         [name, batch_id, program_id]
//       );
//       sectionIds.push({ name, section_id: result.insertId });
//     }
//     res.json({ section_ids: sectionIds });
//   } catch (err) {
//     console.error("Add sections error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };




// controllers/sectionController.js
const { dbPool } = require('../config/db');

exports.getSectionsByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const [rows] = await dbPool.query(
      `SELECT * FROM SECTION WHERE batch_id = ? ORDER BY name ASC`,
      [batchId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sections' });
  }
};

exports.createSections = async (req, res) => {
  try {
    const { batch_id, program_id, sections } = req.body;
    const sectionIds = [];

    for (const name of sections) {
      const [result] = await dbPool.query(
        `INSERT INTO SECTION (name, batch_id, program_id) VALUES (?, ?, ?)`,
        [name, batch_id, program_id]
      );
      sectionIds.push({ name, section_id: result.insertId });
    }

    res.json({ message: 'Sections created', section_ids: sectionIds });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create sections' });
  }
};


exports.getSectionsAll = async (req, res) => {
  try {
    const [rows] = await dbPool.query(
      `SELECT * FROM SECTION ORDER BY name ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching sections:", err);
    res.status(500).json({ error: "Failed to fetch sections" });
  }
};



