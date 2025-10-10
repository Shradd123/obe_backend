// const { dbPool } = require('../config/db');

// // ✅ Add new reference materials
// const addReferenceMaterial = async (req, res) => {
//   try {
//     const { offering_id, title } = req.body;

//     if (!offering_id || !title) {
//       return res.status(400).json({ message: 'offering_id and title are required' });
//     }

//     const [result] = await dbPool.query(
//       `INSERT INTO lab_reference_materials (offering_id, title) VALUES (?, ?)`,
//       [offering_id, title]
//     );

//     res.status(201).json({ 
//       id: result.insertId, 
//       offering_id, 
//       title 
//     });
//   } catch (err) {
//     console.error('Error adding reference material:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // ✅ Get all reference materials for an offering
// const getReferenceMaterials = async (req, res) => {
//   try {
//     const { offering_id } = req.params;

//     if (!offering_id) {
//       return res.status(400).json({ message: 'Offering ID is required' });
//     }

//     const [rows] = await dbPool.query(
//       `SELECT id, title FROM lab_reference_materials WHERE offering_id = ? ORDER BY id`,
//       [offering_id]
//     );

//     res.json(rows);
//   } catch (err) {
//     console.error('Error fetching reference materials:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // ✅ Update a reference material
// const updateReferenceMaterial = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title } = req.body;

//     if (!title) {
//       return res.status(400).json({ message: 'Title is required' });
//     }

//     await dbPool.query(
//       `UPDATE lab_reference_materials SET title = ? WHERE id = ?`,
//       [title, id]
//     );

//     res.json({ message: 'Reference material updated' });
//   } catch (err) {
//     console.error('Error updating reference material:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // ✅ Delete a reference material
// const deleteReferenceMaterial = async (req, res) => {
//   try {
//     const { id } = req.params;

//     await dbPool.query(`DELETE FROM lab_reference_materials WHERE id = ?`, [id]);

//     res.json({ message: 'Reference material deleted' });
//   } catch (err) {
//     console.error('Error deleting reference material:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = {
//   addReferenceMaterial,
//   getReferenceMaterials,
//   updateReferenceMaterial,
//   deleteReferenceMaterial
// };
const { dbPool } = require("../config/db");

// ✅ Add new reference material
const addReferenceMaterial = async (req, res) => {
  try {
    const { offering_id, title } = req.body;

    if (!offering_id || !title?.trim()) {
      return res.status(400).json({ message: "offering_id and title are required" });
    }

    const [result] = await dbPool.query(
      `INSERT INTO lab_reference_materials (offering_id, title) VALUES (?, ?)`,
      [offering_id, title.trim()]
    );

    res.status(201).json({
      id: result.insertId,
      offering_id,
      title: title.trim(),
    });
  } catch (err) {
    console.error("Error adding reference material:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all reference materials for an offering
const getReferenceMaterials = async (req, res) => {
  try {
    const { offering_id } = req.params;

    if (!offering_id) {
      return res.status(400).json({ message: "Offering ID is required" });
    }

    const [rows] = await dbPool.query(
      `SELECT id, title FROM lab_reference_materials WHERE offering_id = ? ORDER BY id`,
      [offering_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching reference materials:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update a reference material
const updateReferenceMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const [result] = await dbPool.query(
      `UPDATE lab_reference_materials SET title = ? WHERE id = ?`,
      [title.trim(), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reference material not found" });
    }

    res.json({ id, title: title.trim(), message: "Reference material updated" });
  } catch (err) {
    console.error("Error updating reference material:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete a reference material
const deleteReferenceMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await dbPool.query(
      `DELETE FROM lab_reference_materials WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reference material not found" });
    }

    res.json({ id, message: "Reference material deleted" });
  } catch (err) {
    console.error("Error deleting reference material:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addReferenceMaterial,
  getReferenceMaterials,
  updateReferenceMaterial,
  deleteReferenceMaterial,
};
