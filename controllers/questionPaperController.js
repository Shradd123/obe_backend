const { dbPool } = require('../config/db');

// 🔧 Helper: convert ISO date to MySQL format
const formatDate = (dateString) => {
  if (!dateString) return null;
  // Convert "2025-11-08T00:00:00.000Z" → "2025-11-08"
  return dateString.split('T')[0];
};

// ---------------------- CREATE QUESTION PAPER ----------------------
exports.createQuestionPaper = async (req, res) => {
  const connection = await dbPool.getConnection();
  try {
    const { paper, parts } = req.body;

    await connection.beginTransaction();

    const [paperResult] = await connection.query(
      `INSERT INTO question_paper_config 
      (type, subject_id, set_name, pattern, title, code, exam_date, time_from, time_to, dept, faculty, sem, section, marks, scheme)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        paper.type,
        paper.subject_id,
        paper.set_name,
        paper.pattern,
        paper.title,
        paper.code,
        formatDate(paper.exam_date), // ✅ formatted
        paper.time_from,
        paper.time_to,
        paper.dept,
        paper.faculty,
        paper.sem,
        paper.section,
        paper.marks,
        paper.scheme
      ]
    );

    const paperId = paperResult.insertId;

    // Insert parts, questions, subquestions
    for (const part of parts) {
      const [partResult] = await connection.query(
        `INSERT INTO question_parts (paper_id, Module) VALUES (?, ?)`,
        [paperId, part.Module]
      );
      const partId = partResult.insertId;

      for (const question of part.questions) {
        const [qResult] = await connection.query(
          `INSERT INTO questions (part_id, qno) VALUES (?, ?)`,
          [partId, question.qno]
        );
        const questionId = qResult.insertId;

        for (const sub of question.subquestions) {
          await connection.query(
            `INSERT INTO subquestions 
            (question_id, label, text, marks, blooms, co, diagram, diagram_path)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              questionId,
              sub.label,
              sub.text,
              sub.marks,
              sub.blooms,
              sub.co,
              sub.diagram || false,
              sub.diagram_path || null
            ]
          );
        }
      }
    }

    await connection.commit();
    res.status(201).json({ success: true, message: 'Question paper created successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating question paper:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    connection.release();
  }
};

// ---------------------- GET QUESTION PAPER ----------------------
exports.getQuestionPaperByTypeAndSubject = async (req, res) => {
  try {
    const { type, subject_id } = req.params;

    const [papers] = await dbPool.query(
      `SELECT * FROM question_paper_config WHERE type = ? AND subject_id = ? LIMIT 1`,
      [type, subject_id]
    );

    if (papers.length === 0) {
      return res.json({ exists: false });
    }

    const paper = papers[0];

    const [parts] = await dbPool.query(
      `SELECT * FROM question_parts WHERE paper_id = ?`,
      [paper.id]
    );

    for (const part of parts) {
      const [questions] = await dbPool.query(
        `SELECT * FROM questions WHERE part_id = ?`,
        [part.id]
      );

      for (const question of questions) {
        const [subquestions] = await dbPool.query(
          `SELECT * FROM subquestions WHERE question_id = ?`,
          [question.id]
        );
        question.subquestions = subquestions;
      }

      part.questions = questions;
    }

    res.json({ exists: true, paper, parts });
  } catch (error) {
    console.error('Error fetching question paper:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ---------------------- UPDATE QUESTION PAPER ----------------------
exports.updateQuestionPaper = async (req, res) => {
  const connection = await dbPool.getConnection();
  try {
    const { paper_id } = req.params;
    const { paper, parts } = req.body;

    await connection.beginTransaction();

    // ✅ Update main question_paper_config
    await connection.query(
      `UPDATE question_paper_config
       SET title=?, code=?, exam_date=?, time_from=?, time_to=?, dept=?, faculty=?, sem=?, section=?, marks=?, scheme=?, set_name=?, pattern=?
       WHERE id=?`,
      [
        paper.title,
        paper.code,
        formatDate(paper.exam_date), // ✅ fixed MySQL format
        paper.time_from,
        paper.time_to,
        paper.dept,
        paper.faculty,
        paper.sem,
        paper.section,
        paper.marks,
        paper.scheme,
        paper.set_name,
        paper.pattern,
        paper_id
      ]
    );

    // ✅ Delete old parts/questions/subquestions
    const [oldParts] = await connection.query(`SELECT id FROM question_parts WHERE paper_id=?`, [paper_id]);

    for (const part of oldParts) {
      const [oldQuestions] = await connection.query(`SELECT id FROM questions WHERE part_id=?`, [part.id]);

      for (const q of oldQuestions) {
        await connection.query(`DELETE FROM subquestions WHERE question_id=?`, [q.id]);
      }

      await connection.query(`DELETE FROM questions WHERE part_id=?`, [part.id]);
    }

    await connection.query(`DELETE FROM question_parts WHERE paper_id=?`, [paper_id]);

    // ✅ Reinsert updated parts/questions/subquestions
    for (const part of parts) {
      const [partResult] = await connection.query(
        `INSERT INTO question_parts (paper_id, Module) VALUES (?, ?)`,
        [paper_id, part.Module]
      );
      const partId = partResult.insertId;

      for (const question of part.questions) {
        const [qResult] = await connection.query(
          `INSERT INTO questions (part_id, qno) VALUES (?, ?)`,
          [partId, question.qno]
        );
        const questionId = qResult.insertId;

        for (const sub of question.subquestions) {
          await connection.query(
            `INSERT INTO subquestions (question_id, label, text, marks, blooms, co, diagram, diagram_path)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              questionId,
              sub.label,
              sub.text,
              sub.marks,
              sub.blooms,
              sub.co,
              sub.diagram || false,
              sub.diagram_path || null
            ]
          );
        }
      }
    }

    await connection.commit();
    res.json({ success: true, message: 'Question paper updated successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating question paper:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    connection.release();
  }
};


// ---------------------- DISPLAY QUESTION PAPER DETAILS ----------------------

exports.displayQuestionPaperDetails = async (req, res) => {
  try {
    const { type, subject_id } = req.params;

    console.log("Fetching for type:", type, "subject_id:", subject_id);

    const [paperResult] = await dbPool.query(
      `SELECT qpc.*, s.name AS subject_name
       FROM question_paper_config qpc
       JOIN subjects s ON qpc.subject_id = s.id
       WHERE LOWER(qpc.type) = LOWER(?) AND qpc.subject_id = ?`,
      [type, subject_id]
    );

    if (paperResult.length === 0) {
      return res.status(404).json({ success: false, message: 'No records found' });
    }

    const paper = paperResult[0];

    // Fetch question structure
    const [parts] = await dbPool.query(
      `SELECT id, Module FROM question_parts WHERE paper_id = ?`,
      [paper.id]
    );

    for (const part of parts) {
      const [questions] = await dbPool.query(
        `SELECT id, qno FROM questions WHERE part_id = ?`,
        [part.id]
      );

      for (const question of questions) {
        const [subquestions] = await dbPool.query(
          `SELECT label, text, marks, co FROM subquestions WHERE question_id = ?`,
          [question.id]
        );
        question.subquestions = subquestions;
      }

      part.questions = questions;
    }

    res.json({
      success: true,
      subject: paper.subject_name,
      type: paper.type,
      set_name: paper.set_name,
      pattern: paper.pattern,
      parts,
    });

  } catch (error) {
    console.error("Error in displayQuestionPaperDetails:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};



// GET paper + modules + questions + subquestions by subject_id and type
exports.getFullQuestionPaperBySubjectAndType = async (req, res) => {
  try {
    const { subject_id, type } = req.params;

    const [rows] = await dbPool.query(
      `SELECT 
          qpc.id AS paper_id,
          qpc.type,
          qpc.subject_id,
          qpc.title,
          qpc.code,
          qp.id AS part_id,
          qp.module AS module_name,
          q.id AS question_id,
          q.qno,
          sq.id AS subquestion_id,
          sq.marks,
          sq.co
       FROM question_paper_config qpc
       JOIN question_parts qp ON qpc.id = qp.paper_id
       JOIN questions q ON qp.id = q.part_id
       JOIN subquestions sq ON q.id = sq.question_id
       WHERE qpc.subject_id = ? AND qpc.type = ?`,
      [subject_id, type]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No records found' });
    }

    // optional: structure the data hierarchically (modules -> questions -> subquestions)
    const structuredData = {};

    rows.forEach(row => {
      if (!structuredData[row.module_name]) {
        structuredData[row.module_name] = {};
      }

      if (!structuredData[row.module_name][row.qno]) {
        structuredData[row.module_name][row.qno] = [];
      }

      structuredData[row.module_name][row.qno].push({
        subquestion_id: row.subquestion_id,
        marks: row.marks,
        co: row.co
      });
    });

    res.json({
      paper_id: rows[0].paper_id,
      subject_id,
      type,
      title: rows[0].title,
      code: rows[0].code,
      modules: structuredData
    });

  } catch (err) {
    console.error('Error fetching question paper:', err);
    res.status(500).json({ error: err.message });
  }
};

