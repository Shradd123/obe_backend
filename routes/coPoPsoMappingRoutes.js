// const express = require('express');
// const router = express.Router();
// const coPoPsoController = require('../controllers/coPoPsoMappingController');

// // Get COs for a course
// router.get('/course-outcome/:offering_id', coPoPsoController.getCourseOutcomes);

// // Get POs for a department
// router.get('/po/:deptId', coPoPsoController.getPOs);

// // Get PSOs for a department
// router.get('/pso/:deptId', coPoPsoController.getPSOs);

// // Get existing mappings for a course
// router.get('/co-po-pso-mapping/:offeringId', coPoPsoController.getMappings);

// // Save/update mappings
// router.post('/co-po-pso-mapping/:offeringId', coPoPsoController.saveMappings);

// module.exports = router;








// const express = require('express');
// const router = express.Router();
// const coPoPsoController = require('../controllers/coPoPsoMappingController');

// // Course outcomes by offering
// router.get('/course-outcome/:offering_id', coPoPsoController.getCourseOutcomes);

// // POs and PSOs by department
// router.get('/po/:deptId', coPoPsoController.getPOs);
// router.get('/pso/:deptId', coPoPsoController.getPSOs);

// // CO-PO-PSO mapping routes
// router.get('/co-po-pso-mapping/:offeringId', coPoPsoController.getMappings);
// router.post('/co-po-pso-mapping/:offeringId', coPoPsoController.saveMappings);

// module.exports = router;





const express = require('express');
const router = express.Router();
const controller = require('../controllers/coPoPsoMappingController');

router.get('/course-outcome/:offering_id', controller.getCourseOutcomes);
router.get('/po/:offering_id', controller.getPOs);
router.get('/pso/:offering_id', controller.getPSOs);
router.get('/mapping/:offering_id', controller.getMappings);
router.post('/mapping/:offering_id', controller.saveMappings);

module.exports = router;
