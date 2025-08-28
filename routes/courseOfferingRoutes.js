// routes/courseOfferingRoutes.js
const express = require("express");
const router = express.Router();
const { dbPool } = require("../config/db");

// ✅ Get all course offerings for a specific batch and semester
router.get("/:batchId/:semId", async (req, res) => {
  const { batchId, semId } = req.params;
  try {
    const [rows] = await dbPool.query(
      `SELECT co.offering_id, co.course_id, c.name, c.code, c.credits, c.nba, c.course_type_id
       FROM course_offering co
       JOIN course c ON co.course_id = c.course_id
       WHERE co.batch_id = ? AND co.sem_id = ?`,
      [batchId, semId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching course offerings:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ Add a course offering (when checkbox is checked)
router.post("/", async (req, res) => {
  const { course_id, sem_id, batch_id } = req.body;

  if (!course_id || !sem_id || !batch_id) {
    return res.status(400).json({ error: "course_id, sem_id, batch_id required" });
  }

  try {
    const [result] = await dbPool.query(
      "INSERT INTO course_offering (course_id, sem_id, batch_id) VALUES (?, ?, ?)",
      [course_id, sem_id, batch_id]
    );
    res.status(201).json({ offering_id: result.insertId, course_id, sem_id, batch_id });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      res.status(409).json({ error: "Course already offered for this batch/semester" });
    } else {
      console.error("Error inserting course offering:", err);
      res.status(500).json({ error: "Database error" });
    }
  }
});

// ✅ Remove a course offering (when checkbox is unchecked)
router.delete("/:offeringId", async (req, res) => {
  const { offeringId } = req.params;
  try {
    await dbPool.query("DELETE FROM course_offering WHERE offering_id = ?", [offeringId]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting course offering:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
