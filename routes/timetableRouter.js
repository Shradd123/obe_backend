const express = require('express');
const router = express.Router();

// Import upload middleware
const upload = require('../middleware/upload');

// Import controller functions
const {
  uploadTimetable,
  getTimetable,
  deleteTimetable
} = require('../controllers/timetableController');

// Route: Upload timetable (expects multipart/form-data with field name "timetable")
router.post('/upload', upload.single('timetable'), uploadTimetable);

// Route: Get all timetables for a specific course
router.get('/course/:course_id', getTimetable);

// Route: Delete a timetable by its ID
router.delete('/:id', deleteTimetable);

module.exports = router;
