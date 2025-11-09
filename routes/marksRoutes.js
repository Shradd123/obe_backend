const express = require('express');
const router = express.Router();
const marksController = require('../controllers/marksController');

router.post('/save', marksController.saveStudentMarks);
router.get('/:paper_id', marksController.getMarksByPaper);
router.get('/:paper_id/:usn', marksController.getMarksByPaperAndStudent);

module.exports = router;
