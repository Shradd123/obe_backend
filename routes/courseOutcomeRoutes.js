const express = require('express');
const router = express.Router();
const courseOutcomeController = require('../controllers/courseOutcomeController');

// Get all COs for a course
router.get('/:course_id', courseOutcomeController.getAll);

// Add a new CO
router.post('/:course_id', courseOutcomeController.create);

// Update a CO
router.put('/:co_id', courseOutcomeController.update);

// Delete a CO
router.delete('/:co_id', courseOutcomeController.remove);

module.exports = router;
