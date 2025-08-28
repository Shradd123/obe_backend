const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');

// const authenticateJWT = require('../middleware/authenticateJWT'); // if needed

// Add new faculty

router.post('/login', facultyController.login);

router.post('/', facultyController.createFaculty);
// Get all faculty
router.get('/', facultyController.getAllFaculty);

// Get faculty by ID
router.get('/:id', facultyController.getFacultyById);

// Delete faculty
router.delete('/:id', facultyController.deleteFaculty);

router.get('/:id/dept', facultyController.getFacultyDept);

// ✅ Get all programs for faculty’s dept
router.get('/:id/programs', facultyController.getFacultyPrograms);


// ✅ New: Get all faculty by department ID
router.get("/dept/:deptId", facultyController.getFacultyByDeptId);



router.get("/:facultyId/dept", facultyController.getDeptByFacultyId);
module.exports = router;
