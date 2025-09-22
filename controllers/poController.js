// controllers/poController.js
const { dbPool } = require('../config/db');

// ✅ Get all POs by department
exports.getPOsByDepartment = async (req, res) => {
  try {
    const { dept_id } = req.params;

    if (!dept_id) {
      return res.status(400).json({ error: "dept_id is required" });
    }

    const [rows] = await dbPool.query(
      "SELECT * FROM po WHERE dept_id = ? ORDER BY po_no",
      [dept_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching POs:", err);
    res.status(500).json({ error: "Failed to fetch POs" });
  }
};

// ✅ Create new PO
exports.createPO = async (req, res) => {
  try {
    const { dept_id, po_no, title, description } = req.body;

    if (!dept_id || !po_no || !title || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await dbPool.query(
      "INSERT INTO po (dept_id, po_no, title, description) VALUES (?, ?, ?, ?)",
      [dept_id, po_no, title, description]
    );

    res.json({ message: "PO created successfully" });
  } catch (err) {
    console.error("❌ Error creating PO:", err);
    res.status(500).json({ error: "Failed to create PO" });
  }
};

// ✅ Update PO
exports.updatePO = async (req, res) => {
  try {
    const { id } = req.params;
    const { po_no, title, description } = req.body;

    await dbPool.query(
      "UPDATE po SET po_no = ?, title = ?, description = ? WHERE po_id = ?",
      [po_no, title, description, id]
    );

    res.json({ message: "PO updated successfully" });
  } catch (err) {
    console.error("❌ Error updating PO:", err);
    res.status(500).json({ error: "Failed to update PO" });
  }
};

// ✅ Delete PO
exports.deletePO = async (req, res) => {
  try {
    const { id } = req.params;

    await dbPool.query("DELETE FROM po WHERE po_id = ?", [id]);

    res.json({ message: "PO deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting PO:", err);
    res.status(500).json({ error: "Failed to delete PO" });
  }
};
