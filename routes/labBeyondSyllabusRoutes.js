// // routes/labBeyondSyllabusRoutes.js
// const express = require("express");
// const router = express.Router();
// const {
//   saveLabCurriculumGapAnalysis,
//   getLabCurriculumGapAnalysis,
// } = require("../controllers/labBeyondSyllabusController");

// // POST: Save curriculum gap analysis
// router.post("/lab-curriculum-gap-analysis", saveLabCurriculumGapAnalysis);

// // GET: Fetch existing data
// router.get("/lab-curriculum-gap-analysis/:offering_id", getLabCurriculumGapAnalysis);

// module.exports = router;
const express = require("express");
const router = express.Router();
const {
  saveLabCurriculumGapAnalysis,
  getLabCurriculumGapAnalysis,
} = require("../controllers/labBeyondSyllabusController");

// ✅ POST route to save data
router.post("/lab-curriculum-gap-analysis", saveLabCurriculumGapAnalysis);

// ✅ GET route to fetch data by offering_id
router.get("/lab-curriculum-gap-analysis/:offering_id", getLabCurriculumGapAnalysis);

module.exports = router;
