const express = require('express');
const router = express.Router();
const marksController = require('../controllers/marksController');

// Assignment marks
router.post("/assignment/save", marksController.saveAssignmentMarks);
router.get('/assignment/totals/:offering_id', marksController.getAssignmentTotals);
router.get("/assignment/student/:student_id/:offering_id", marksController.getAssignmentMarks);

// Exam Marks
router.post('/exam/save', marksController.saveStudentMarks);
router.get('/exam/:paper_id', marksController.getMarksByPaper);
router.get('/exam/:paper_id/:usn', marksController.getMarksByPaperAndStudent);

module.exports = router;
