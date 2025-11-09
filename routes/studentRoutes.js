// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
//const { getStudentsByOffering } = require('../controllers/studentController');

// Route: GET /api/students/offering/:offering_id
router.get('/offering/:offering_id', studentController.getStudentsByOffering);

router.get('/section/:sectionId', studentController.getStudentsBySection);
router.post('/', studentController.addStudent);


module.exports = router; // ✅ Export the router, not an object