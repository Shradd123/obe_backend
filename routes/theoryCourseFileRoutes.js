// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const fs = require('fs');

// const path = require('path');
// const {
//   uploadController,
//   saveMergedPDF,
//   getMergedPDFs,
// } = require('../controllers/theoryCourseFileController');

// // Multer config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = path.join(__dirname, '../uploads');
//     if (!fs.existsSync(dir)) fs.mkdirSync(dir); // ensure folder exists
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });
// const upload = multer({ storage });

// // Upload single PDF
// router.post('/upload', upload.single('file'), uploadController);

// // Save merged PDF info
// router.post('/save-merged-pdf', saveMergedPDF);

// // Get merged PDFs
// router.get('/:offering_id/merged-pdfs', getMergedPDFs);

// module.exports = router;


const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const { uploadController, mergePDFs, saveMergedPDF, getMergedPDFs } = require('../controllers/theoryCourseFileController');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
router.post('/upload', upload.single('file'), uploadController);
router.post('/merge-pdf', mergePDFs);
router.post('/save-merged-pdf', saveMergedPDF);
router.get('/:offering_id/merged-pdfs', getMergedPDFs);

module.exports = router;
