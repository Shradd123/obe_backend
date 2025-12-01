const express = require("express");
const router = express.Router();
const examController = require("../controllers/examTotalMarksController");

router.post("/", examController.saveExamTotalMarks);
router.get("/paper/:paper_id", examController.getMarksByPaper);
router.get("/student/:student_id", examController.getMarksByStudent);
router.delete("/:id", examController.deleteMarks);

module.exports = router;
