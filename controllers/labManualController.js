// controllers/labManualController.js
const path = require("path");
const fs = require("fs");
const { dbPool } = require("../config/db");

const addLabManual = async (req, res) => {
  try {
    // multer attaches file as req.file
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    const { offering_id, uploaded_by } = req.body;

    if (!offering_id) {
      // remove uploaded file because missing data
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "offering_id is required" });
    }

    const fileName = req.file.filename;
    const filePath = path.join("/uploads", "lab-manuals", fileName); // for serving

    const [result] = await dbPool.query(
      `INSERT INTO lab_manuals (offering_id, file_name, file_path, uploaded_by) VALUES (?, ?, ?, ?)`,
      [offering_id, req.file.originalname, filePath, uploaded_by || null]
    );

    res.status(201).json({
      id: result.insertId,
      offering_id: Number(offering_id),
      file_name: req.file.originalname,
      file_path: filePath,
      uploaded_by: uploaded_by || null,
    });
  } catch (err) {
    console.error("Error adding lab manual:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getLabManualsByOffering = async (req, res) => {
  try {
    const { offering_id } = req.params;
    if (!offering_id) return res.status(400).json({ message: "Offering ID is required" });

    const [rows] = await dbPool.query(
      `SELECT id, offering_id, file_name, file_path, uploaded_by, uploaded_at
       FROM lab_manuals WHERE offering_id = ? ORDER BY id`,
      [offering_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching lab manuals:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteLabManual = async (req, res) => {
  try {
    const { id } = req.params;

    // fetch record to remove file
    const [rows] = await dbPool.query(`SELECT file_path FROM lab_manuals WHERE id = ?`, [id]);
    if (!rows.length) return res.status(404).json({ message: "Manual not found" });

    const filePath = rows[0].file_path;
    // delete DB record
    const [result] = await dbPool.query(`DELETE FROM lab_manuals WHERE id = ?`, [id]);

    // remove file from disk (if exists)
    const fullPath = path.join(__dirname, "..", filePath);
    fs.unlink(fullPath, (err) => {
      if (err) {
        // log but still succeed
        console.warn("Failed to delete file from disk:", fullPath, err.message);
      }
    });

    res.json({ id, message: "Lab manual deleted" });
  } catch (err) {
    console.error("Error deleting lab manual:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addLabManual, getLabManualsByOffering, deleteLabManual };
