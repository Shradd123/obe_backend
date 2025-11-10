const express = require('express');
const router = express.Router();
const marksController = require('../controllers/marksController');


// Save or update assignment marks
router.post("/save", marksController.saveAssignmentMarks);
router.get('/totals/:offering_id', marksController.getAssignmentTotals);

router.get("/student/:student_id/:offering_id", marksController.getAssignmentMarks); // ✅ new route
router.post('/save', marksController.saveStudentMarks);
router.get('/:paper_id', marksController.getMarksByPaper);
router.get('/:paper_id/:usn', marksController.getMarksByPaperAndStudent);

module.exports = router;
