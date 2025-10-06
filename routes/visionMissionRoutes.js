const express = require('express');
const router = express.Router();
const { getVisionAndMission } = require('../controllers/visionMissionController');

// Route: GET /api/vision-mission/:course_id

router.get('/:offering_id', getVisionAndMission);


module.exports = router;
