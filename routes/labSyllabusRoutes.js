const express = require('express');
const router = express.Router();
const labSyllabusController = require('../controllers/labSyllabusController');

// GET: fetch all experiments for a course offering
router.get('/:offering_id', labSyllabusController.getLabSyllabus);

// POST: save/update experiments for a course offering
router.post('/:offering_id', labSyllabusController.saveLabSyllabus);

module.exports = router;
