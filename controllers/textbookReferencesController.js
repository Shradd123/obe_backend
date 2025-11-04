const { dbPool } = require("../config/db");

// ==============================
// GET all references for offering
// ==============================
const getTextbookReferences = async (req, res) => {
  try {
    const { offering_id } = req.params;
    if (!offering_id)
      return res.status(400).json({ message: "Missing offering ID" });

    const [rows] = await dbPool.query(
      "SELECT reference_text FROM textbook_references WHERE offering_id = ?",
      [offering_id]
    );

    const references = rows.map((r) => r.reference_text);
    res.json({ references });
  } catch (err) {
    console.error("Error fetching textbook references:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// SAVE (replace all) references
// ==============================
const saveTextbookReferences = async (req, res) => {
  try {
    const { offering_id } = req.params;
    const { references } = req.body;

    if (!offering_id)
      return res.status(400).json({ message: "Missing offering ID" });
    if (!Array.isArray(references))
      return res.status(400).json({ message: "Invalid data format" });

    // Remove old ones
    await dbPool.query("DELETE FROM textbook_references WHERE offering_id = ?", [
      offering_id,
    ]);

    // Insert new ones
    for (const ref of references) {
      await dbPool.query(
        "INSERT INTO textbook_references (offering_id, reference_text) VALUES (?, ?)",
        [offering_id, ref]
      );
    }

    res.json({ message: "Textbook References Saved Successfully" });
  } catch (err) {
    console.error("Error saving textbook references:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getTextbookReferences,
  saveTextbookReferences,
};
