const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  uploadLabTimetable,
  getLabTimetablesByCourse,
  deleteLabTimetable
} = require('../controllers/labTimetableController');

// 📁 Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/lab_timetables');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// 📥 Upload File
router.post('/upload', upload.single('lab_timetable'), uploadLabTimetable);

// 📤 Get All Files by Course
router.get('/course/:courseId', getLabTimetablesByCourse);

// 🗑️ Delete File
router.delete('/:id', deleteLabTimetable);

module.exports = router;
