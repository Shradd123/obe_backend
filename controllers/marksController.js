const { dbPool } = require('../config/db');

/* -------------------------------------------------------
   ✅ Save or Update Marks (with module column)
------------------------------------------------------- */
exports.saveStudentMarks = async (req, res) => {
  const { paper_id, marksData } = req.body;

  if (!paper_id || !marksData || !Array.isArray(marksData)) {
    return res.status(400).json({ error: 'Invalid data format.' });
  }

  const conn = await dbPool.getConnection();
  try {
    await conn.beginTransaction();

    for (const entry of marksData) {
      const { student_usn, subquestion_id, marks_awarded, module } = entry;

      if (!student_usn || !subquestion_id) continue;

      await conn.query(
        `
        INSERT INTO student_marks_entry 
          (paper_id, student_usn, subquestion_id, marks_awarded, module)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          marks_awarded = VALUES(marks_awarded),
          module = VALUES(module)
        `,
        [paper_id, student_usn, subquestion_id, marks_awarded ?? 0, module || null]
      );
    }

    await conn.commit();
    res.json({ success: true, message: 'Marks saved successfully with module!' });
  } catch (err) {
    await conn.rollback();
    console.error('❌ Error saving marks:', err);
    res.status(500).json({ error: 'Failed to save marks.' });
  } finally {
    conn.release();
  }
};

/* -------------------------------------------------------
   ✅ Get all marks for one paper (include module)
------------------------------------------------------- */
exports.getMarksByPaper = async (req, res) => {
  const { paper_id } = req.params;

  try {
    const [rows] = await dbPool.query(
      `
      SELECT 
        sme.*, 
        sq.label AS sub_label, 
        sq.marks AS max_marks, 
        q.qno, 
        qp.Module AS paper_module
      FROM student_marks_entry sme
      JOIN subquestions sq ON sme.subquestion_id = sq.id
      JOIN questions q ON sq.question_id = q.id
      JOIN question_parts qp ON q.part_id = qp.id
      WHERE sme.paper_id = ?
      ORDER BY sme.student_usn, qp.Module, q.qno, sq.label
      `,
      [paper_id]
    );

    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching marks:', err);
    res.status(500).json({ error: 'Failed to fetch marks.' });
  }
};

/* -------------------------------------------------------
   ✅ Get marks for one student in one paper (include module)
------------------------------------------------------- */
exports.getMarksByPaperAndStudent = async (req, res) => {
  const { paper_id, usn } = req.params;

  try {
    const [rows] = await dbPool.query(
      `
      SELECT 
        sme.*, 
        sq.label AS sub_label, 
        sq.marks AS max_marks, 
        q.qno, 
        qp.Module AS paper_module
      FROM student_marks_entry sme
      JOIN subquestions sq ON sme.subquestion_id = sq.id
      JOIN questions q ON sq.question_id = q.id
      JOIN question_parts qp ON q.part_id = qp.id
      WHERE sme.paper_id = ? AND sme.student_usn = ?
      ORDER BY qp.Module, q.qno, sq.label
      `,
      [paper_id, usn]
    );

    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching student marks:', err);
    res.status(500).json({ error: 'Failed to fetch student marks.' });
  }
};
