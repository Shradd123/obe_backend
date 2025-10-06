const { dbPool } = require("../config/db");

// Fetch POs and PSOs by offering_id
exports.getPOsByCourse = async (req, res) => {
  try {
    const { offering_id } = req.params;
    if (!offering_id) return res.status(400).json({ error: "Offering ID is required" });

    // Get dept_id from offering_id → course_offering → course → schema_course → schema_table → program → dept
    const [deptRows] = await dbPool.query(
      `
      SELECT pr.dept_id
      FROM course_offering co
      JOIN course c ON c.course_id = co.course_id
      JOIN schema_course sc ON sc.course_id = c.course_id
      JOIN schema_table st ON st.schema_id = sc.schema_id
      JOIN program pr ON pr.program_id = st.program_id
      WHERE co.offering_id = ?
      LIMIT 1
      `,
      [offering_id]
    );

    if (!deptRows.length) return res.status(404).json({ error: "Department not found" });

    const deptId = deptRows[0].dept_id;

    // Fetch POs
    const [poRows] = await dbPool.query(
      "SELECT * FROM po WHERE dept_id = ? ORDER BY po_no",
      [deptId]
    );

    // Fetch PSOs
    const [psoRows] = await dbPool.query(
      "SELECT * FROM pso WHERE dept_id = ? ORDER BY pso_id",
      [deptId]
    );

    res.json({ POs: poRows, PSOs: psoRows });
  } catch (err) {
    console.error("❌ Error fetching POs/PSOs by offering:", err);
    res.status(500).json({ error: "Failed to fetch POs/PSOs" });
  }
};

// CRUD for PO (unchanged)
exports.createPO = async (req, res) => {
  const { dept_id, po_no, title, description } = req.body;
  if (!dept_id || !po_no || !title || !description)
    return res.status(400).json({ error: "All fields required" });
  try {
    await dbPool.query(
      "INSERT INTO po (dept_id, po_no, title, description) VALUES (?, ?, ?, ?)",
      [dept_id, po_no, title, description]
    );
    res.json({ message: "PO created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create PO" });
  }
};

exports.updatePO = async (req, res) => {
  const { id } = req.params;
  const { po_no, title, description } = req.body;
  try {
    await dbPool.query(
      "UPDATE po SET po_no=?, title=?, description=? WHERE po_id=?",
      [po_no, title, description, id]
    );
    res.json({ message: "PO updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update PO" });
  }
};

exports.deletePO = async (req, res) => {
  const { id } = req.params;
  try {
    await dbPool.query("DELETE FROM po WHERE po_id=?", [id]);
    res.json({ message: "PO deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete PO" });
  }
};
