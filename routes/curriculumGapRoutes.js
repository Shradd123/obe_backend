// routes/curriculumGapRoutes.js
const express = require('express');
const router = express.Router();
const curriculumGapController = require('../controllers/curriculumGapController');

// Save (Insert/Update) using offeringId
router.post('/curriculum-gap/save', curriculumGapController.saveCurriculumGapAnalysis);

// Fetch by offeringId
router.get('/curriculum-gap/:offeringId', curriculumGapController.getCurriculumGapAnalysis);

module.exports = router;