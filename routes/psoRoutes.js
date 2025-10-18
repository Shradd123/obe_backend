const express = require('express');
const router = express.Router();
const psoController = require('../controllers/psoController');

// GET all PSOs for a given offering_id
router.get('/:offering_id', psoController.getPSOsByOfferingId);

module.exports = router;
