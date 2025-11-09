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

// 


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







// controllers/questionPaperController.js


// Filename: questionPaperController.js

exports.getFullQuestionPaper = async (req, res) => {
    const { subject, type, set_name, pattern } = req.params;

    try {
        const [rows] = await dbPool.query(
            `
            SELECT 
                qpc.id AS paper_id,
                qpc.subject_id,
                qpc.type,
                qpc.set_name,
                qpc.pattern,
                qpc.title,
                qpc.code,
                qpc.exam_date,
                qpc.time_from,
                qpc.time_to,
                qpc.dept,
                qpc.faculty,
                qpc.sem,
                qpc.section,
                qpc.marks,
                qpc.scheme,
                qp.id AS part_id,
                qp.Module,
                q.id AS question_id,
                q.qno,
                sq.id AS subquestion_id,
                sq.label,
                sq.text,
                sq.marks AS sub_marks,
                sq.blooms,
                sq.co,
                sq.diagram,
                sq.diagram_path
            FROM question_paper_config qpc
            JOIN question_parts qp ON qpc.id = qp.paper_id
            JOIN questions q ON qp.id = q.part_id
            JOIN subquestions sq ON q.id = sq.question_id
            WHERE 
                qpc.subject_id = ?
                AND qpc.type = ?
                AND qpc.set_name = ?
                AND qpc.pattern = ?
            ORDER BY qp.Module, q.qno, sq.label
            `,
            [subject, type, set_name, pattern]
        );

        if (rows.length === 0) {
            // Return 404 if no paper found, as handled by the frontend
            return res.status(404).json({ success: false, message: 'No question paper found' });
        }

        // --- Data Grouping and Transformation ---
        const paperConfig = rows[0];
        const partsMap = new Map(); // Key: part_id

        rows.forEach((row) => {
            if (!partsMap.has(row.part_id)) {
                partsMap.set(row.part_id, {
                    part_id: row.part_id,
                    Module: row.Module,
                    questionsMap: new Map(),
                    totalMarks: 0, // Initialize total marks for the part
                });
            }

            const currentPart = partsMap.get(row.part_id);

            // Group by question number (qno) within the part
            if (!currentPart.questionsMap.has(row.question_id)) {
                currentPart.questionsMap.set(row.question_id, {
                    question_id: row.question_id,
                    qno: row.qno,
                    subquestions: [],
                });
            }

            // Push subquestion details
            const currentQuestion = currentPart.questionsMap.get(row.question_id);
            const subMarks = parseInt(row.sub_marks) || 0;
            
            currentQuestion.subquestions.push({
                subquestion_id: row.subquestion_id,
                label: row.label,
                text: row.text,
                marks: subMarks,
                blooms: row.blooms,
                co: row.co,
                diagram: !!row.diagram,
                diagram_path: row.diagram_path,
            });

            // Calculate total marks for the module
            currentPart.totalMarks += subMarks;
        });

        // Convert Maps to array structure expected by the frontend
        const parts = Array.from(partsMap.values()).map(part => ({
            Module: part.Module,
            totalMarks: part.totalMarks.toString(), // Ensure it's a string to match frontend state
            questions: Array.from(part.questionsMap.values()).map(question => ({
                qno: question.qno,
                subquestions: question.subquestions,
            })),
        }));


        res.json({
            success: true,
            paper: {
                id: paperConfig.paper_id,
                paper_id: paperConfig.paper_id,
                subject_id: paperConfig.subject_id,
                type: paperConfig.type,
                set_name: paperConfig.set_name,
                pattern: paperConfig.pattern,
                title: paperConfig.title,
                code: paperConfig.code,
                exam_date: paperConfig.exam_date,
                time_from: paperConfig.time_from,
                time_to: paperConfig.time_to,
                dept: paperConfig.dept,
                faculty: paperConfig.faculty,
                sem: paperConfig.sem,
                section: paperConfig.section,
                marks: paperConfig.marks,
                scheme: paperConfig.scheme,
            },
            parts: parts, // Pass the structured array of parts
        });

    } catch (error) {
        console.error('❌ Error fetching question paper:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};






// WARNING: Assuming this is the code for the marks entry API endpoint
exports.getQuestionPaperByParams = async (req, res) => {
    try {
        // Renamed subject_id to subject for consistency with current frontend naming, 
        // but keep the parameter name as subject_id for clarity.
        const { subject_id, type, set_name } = req.params; 

        const [rows] = await dbPool.query(
            `
            SELECT 
                qpc.id AS paper_id,
                qpc.type,
                qpc.subject_id,
                qpc.set_name,
                qpc.pattern,
                qpc.title,
                qpc.code,
                qpc.exam_date,
                qpc.time_from,
                qpc.time_to,
                qpc.dept,
                qpc.faculty,
                qpc.sem,
                qpc.section,
                qpc.marks AS total_marks_config,
                qpc.scheme,
                qp.id AS part_id,
                qp.module AS Module, -- Use 'Module' for frontend consistency
                q.id AS question_id,
                q.qno,
                sq.id AS subquestion_id,
                sq.label,
                sq.text,
                sq.marks AS sub_marks, -- Renamed to sub_marks
                sq.co,
                sq.blooms,
                sq.diagram,
                sq.diagram_path
            FROM question_paper_config qpc
            JOIN question_parts qp ON qpc.id = qp.paper_id
            JOIN questions q ON qp.id = q.part_id
            JOIN subquestions sq ON q.id = sq.question_id
            WHERE qpc.subject_id = ? 
              AND qpc.type = ?
              AND qpc.set_name = ?
            ORDER BY qp.module, q.qno, sq.label;
            `,
            [subject_id, type, set_name]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'No question paper found for given parameters.' });
        }

        // --- Data Grouping and Transformation (Same logic as before, for consistency) ---
        const paperConfig = rows[0];
        const partsMap = new Map();

        rows.forEach((row) => {
            if (!partsMap.has(row.part_id)) {
                partsMap.set(row.part_id, {
                    Module: row.Module,
                    questionsMap: new Map(),
                    totalMarks: 0,
                });
            }

            const currentPart = partsMap.get(row.part_id);

            if (!currentPart.questionsMap.has(row.question_id)) {
                currentPart.questionsMap.set(row.question_id, {
                    qno: row.qno,
                    subquestions: [],
                });
            }

            const currentQuestion = currentPart.questionsMap.get(row.question_id);
            const subMarks = parseInt(row.sub_marks) || 0;
            
            currentQuestion.subquestions.push({
                label: row.label,
                text: row.text,
                marks: subMarks,
                co: row.co,
            });

            currentPart.totalMarks += subMarks;
        });

        const parts = Array.from(partsMap.values()).map(part => ({
            Module: part.Module,
            totalMarks: part.totalMarks.toString(),
            questions: Array.from(part.questionsMap.values()).map(question => ({
                qno: question.qno,
                subquestions: question.subquestions,
            })),
        }));


        res.json({
            success: true,
            paper: { // Frontend expects a 'paper' object for config details
                id: paperConfig.paper_id,
                subject_id: paperConfig.subject_id,
                type: paperConfig.type,
                set_name: paperConfig.set_name,
                pattern: paperConfig.pattern,
                title: paperConfig.title,
                code: paperConfig.code,
                // Include other config details here
            },
            parts: parts, // Frontend expects 'parts' array for questions
        });

    } catch (error) {
        console.error('❌ Error fetching question paper:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};