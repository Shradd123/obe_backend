const express = require('express');
const router = express.Router();
const { getPEOs } = require('../controllers/peoController');

// GET /api/peos/:course_id
router.get('/:offering_id', getPEOs);

module.exports = router;
