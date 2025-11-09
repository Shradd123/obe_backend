
const express = require('express');
const router = express.Router();
const {
  createQuestionPaper,
  getQuestionPaperByTypeAndSubject,
  updateQuestionPaper,
  displayQuestionPaperDetails,
  getFullQuestionPaperBySubjectAndType,
} = require('../controllers/questionPaperController');



// Existing ones
router.post('/create', createQuestionPaper);
router.get('/:type/:subject_id', getQuestionPaperByTypeAndSubject);
router.put('/update/:paper_id', updateQuestionPaper);
router.get('/full/:subject_id/:type', getFullQuestionPaperBySubjectAndType);
const { getFullQuestionPaper } = require('../controllers/questionPaperController');

// Example route:

router.get('/full/:subject/:type/:set_name/:pattern', getFullQuestionPaper);



module.exports = router;





const { dbPool } = require('../config/db');
// GET existing paper by type and subject_id
router.get("/get", async (req, res) => {
  const { type, subject } = req.query;

  try {
    const [rows] = await dbPool.query(
      "SELECT * FROM question_paper_config WHERE type = ? AND subject_id = ?",
      [type, subject]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "No paper found" });
    }

    const paper = rows[0];

    // Fetch parts
    const [parts] = await dbPool.query(
      "SELECT * FROM question_parts WHERE paper_id = ?",
      [paper.id]
    );

    for (let part of parts) {
      const [questions] = await dbPool.query(
        "SELECT * FROM questions WHERE part_id = ?",
        [part.id]
      );

      for (let q of questions) {
        const [subqs] = await dbPool.query(
          "SELECT * FROM subquestions WHERE question_id = ?",
          [q.id]
        );
        q.subquestions = subqs;
      }

      part.questions = questions;
    }

    res.json({
      success: true,
      paper,
      parts,
    });
  } catch (err) {
    console.error("Error fetching paper:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


module.exports = router;


