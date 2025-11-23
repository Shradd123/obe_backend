// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');
// const {
//   uploadLabTimetable,
//   getLabTimetablesByOffering,
//   deleteLabTimetable,
// } = require('../controllers/labTimetableController');

// // 📁 Multer Configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/lab_timetables');
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// // 📥 Upload File
// router.post('/upload', upload.single('lab_timetable'), uploadLabTimetable);

// // 📤 Get All Files by Offering
// router.get('/offering/:offeringId', getLabTimetablesByOffering);

// // 🗑️ Delete File
// router.delete('/:id', deleteLabTimetable);

// module.exports = router;



const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  uploadLabTimetable,
  getLabTimetablesByCourse,
  deleteLabTimetable,
} = require('../controllers/labTimetableController');

// 📁 Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/lab_timetables'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes

// 📥 Upload Lab Timetable
// ✅ The field name in frontend should be 'lab_timetable' to match multer.single()
router.post('/upload', upload.single('lab_timetable'), uploadLabTimetable);

// 📤 Get all lab timetables by course
router.get('/course/:courseId', getLabTimetablesByCourse);

// 🗑️ Delete a lab timetable
router.delete('/:id', deleteLabTimetable);

module.exports = router;
