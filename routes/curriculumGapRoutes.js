// routes/curriculumGapRoutes.js
const express = require('express');
const router = express.Router();
const curriculumGapController = require('../controllers/curriculumGapController');

// Save (Insert/Update)
router.post('/curriculum-gap/save', curriculumGapController.saveCurriculumGapAnalysis);

// Fetch by course_id
router.get('/curriculum-gap/:course_id', curriculumGapController.getCurriculumGapAnalysis);

module.exports = router;


