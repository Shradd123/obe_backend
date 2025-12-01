const { dbPool } = require('../config/db');



exports.saveExamTotalMarks = async (req, res) => {
  try {
    const { student_id, paper_id, type, exam_total_marks } = req.body;

    if (!student_id || !paper_id || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const query = `
      INSERT INTO exam_total_marks (student_id, paper_id, type, exam_total_marks)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        exam_total_marks = VALUES(exam_total_marks),
        type = VALUES(type)
    `;

    const [result] = await dbPool.execute(query, [
      student_id,
      paper_id,
      type,
      exam_total_marks,
    ]);

    res.status(200).json({ message: "Total marks saved/updated successfully", result });

  } catch (err) {
    console.error("Error saving total marks", err);
    res.status(500).json({ error: err.message });
  }
};

// Fetch marks by paper
exports.getMarksByPaper = async (req, res) => {
  try {
    const { paper_id } = req.params;

    const [rows] = await dbPool.query(
      `SELECT etm.*, s.name, s.usn 
       FROM exam_total_marks etm
       JOIN student s ON etm.student_id = s.student_id
       WHERE etm.paper_id = ?`, 
      [paper_id]
    );

    res.json(rows);

  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Fetch marks by student
exports.getMarksByStudent = async (req, res) => {
  try {
    const { student_id } = req.params;

    const [rows] = await dbPool.query(
      `SELECT * FROM exam_total_marks WHERE student_id = ?`,
      [student_id]
    );

    res.json(rows);

  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete record
exports.deleteMarks = async (req, res) => {
  try {
    const { id } = req.params;

    await dbPool.query(`DELETE FROM exam_total_marks WHERE id = ?`, [id]);

    res.json({ success: true, message: "Record deleted." });

  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: error.message });
  }
};
