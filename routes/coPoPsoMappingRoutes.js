const express = require('express');
const router = express.Router();
const coPoPsoController = require('../controllers/coPoPsoMappingController');

// Get COs for a course
router.get('/course-outcome/:courseId', coPoPsoController.getCourseOutcomes);

// Get POs for a department
router.get('/po/:deptId', coPoPsoController.getPOs);

// Get PSOs for a department
router.get('/pso/:deptId', coPoPsoController.getPSOs);

// Get existing mappings for a course
router.get('/co-po-pso-mapping/:courseId', coPoPsoController.getMappings);

// Save/update mappings
router.post('/co-po-pso-mapping/:courseId', coPoPsoController.saveMappings);

module.exports = router;
