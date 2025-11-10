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



const { db } = require('../config/db');








exports.saveAssignmentMarks = async (req, res) => {
  try {
    const { faculty_id, offering_id, student_id, coMarks, totalMarks } = req.body;

    if (!faculty_id || !offering_id || !student_id || !coMarks) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // 1️⃣ Validate student exists
    const [studentRows] = await dbPool.query(
      'SELECT student_id FROM student WHERE student_id = ?',
      [student_id]
    );
    if (studentRows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // 2️⃣ Get course outcomes for offering
    const [coRows] = await dbPool.query(
      'SELECT co_id, co_no FROM course_outcome WHERE offering_id = ?',
      [offering_id]
    );
    if (!coRows.length) {
      return res.status(404).json({ message: 'No course outcomes found for this offering' });
    }

    // 3️⃣ Insert or update marks
    for (const co of coRows) {
      const marks = coMarks[co.co_no] ?? 0;

      await dbPool.query(
        `INSERT INTO assignment_marks_entry 
         (faculty_id, offering_id, student_id, co_id, co_no, marks_awarded, total_marks)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
           marks_awarded = VALUES(marks_awarded),
           total_marks = VALUES(total_marks),
           updated_at = CURRENT_TIMESTAMP`,
        [faculty_id, offering_id, student_id, co.co_id, co.co_no, marks, totalMarks]
      );
    }

    res.status(200).json({ message: '✅ Assignment marks saved successfully' });
  } catch (error) {
    console.error('❌ Error saving assignment marks:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// ✅ Get saved assignment marks for a student & offering
exports.getAssignmentMarks = async (req, res) => {
  try {
    const { student_id, offering_id } = req.params;

    const [rows] = await dbPool.query(
      `SELECT co_no, marks_awarded, total_marks 
       FROM assignment_marks_entry 
       WHERE student_id = ? AND offering_id = ?`,
      [student_id, offering_id]
    );

    if (!rows.length) {
      return res.status(200).json([]); // no marks yet
    }

    // Format data as coMarks object like frontend expects
    const coMarks = {};
    rows.forEach((r) => {
      coMarks[r.co_no] = Number(r.marks_awarded);
    });

    res.status(200).json({ coMarks, totalMarks: rows[0].total_marks });
  } catch (error) {
    console.error("❌ Error fetching assignment marks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ Get total marks per student for a given offering
exports.getAssignmentTotals = async (req, res) => {
  try {
    const { offering_id } = req.params;

    const [rows] = await dbPool.query(
      `SELECT s.student_id, s.name AS student_name, s.usn,
              IFNULL(SUM(a.marks_awarded), 0) AS total_marks
       FROM student s
       LEFT JOIN assignment_marks_entry a 
         ON s.student_id = a.student_id AND a.offering_id = ?
       GROUP BY s.student_id`,
      [offering_id]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching total marks:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

