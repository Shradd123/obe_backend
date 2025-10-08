const express = require('express');
const router = express.Router();
const labCourseCoverPageController = require('../controllers/labCourseCoverPageController');

// Get Lab Course Cover Page for a specific offering
router.get('/:offering_id', labCourseCoverPageController.getLabCourseCoverPage);

// Save or update Lab Course Cover Page
router.post('/:offering_id', labCourseCoverPageController.saveLabCourseCoverPage);

module.exports = router;
