// // routes/curriculumGapRoutes.js
// const express = require('express');
// const router = express.Router();
// const curriculumGapController = require('../controllers/curriculumGapController');

// // Save (Insert/Update)
// router.post('/curriculum-gap/save', curriculumGapController.saveCurriculumGap);

// // Fetch by offeringId
// router.get('/curriculum-gap/:offering_id', curriculumGapController.getCurriculumGap);

// module.exports = router;

// routes/curriculumGapRoutes.js
// const express = require('express');
// const router = express.Router();
// const curriculumGapController = require('../controllers/curriculumGapController');

// router.post('/curriculum-gap/save', curriculumGapController.saveCurriculumGapAnalysis);
// router.get('/curriculum-gap/:offeringId', curriculumGapController.getCurriculumGapAnalysis);

// module.exports = router;





// routes/curriculumGapRoutes.js
const express = require("express");
const router = express.Router();
const curriculumGapController = require("../controllers/curriculumGapController");

router.post("/curriculum-gap/save", curriculumGapController.saveCurriculumGapAnalysis);
router.get("/curriculum-gap/:offeringId", curriculumGapController.getCurriculumGapAnalysis);

module.exports = router;
