// const express = require('express');
// const router = express.Router();
// const uploadLabPDF = require('../middleware/uploadLabFiles');
// const {
// uploadLabCourseFile,
// } = require('../controllers/labCourseFileController');


// router.post('/lab-course-files/upload', uploadLabPDF.single('file'), uploadLabCourseFile);
// router.get('/lab-course-files/:offering_id', require('../controllers/labCourseFileController').getLabCourseFiles);


// module.exports = router;





// const express = require('express');
// const router = express.Router();
// const path = require('path');
// const fs = require('fs');

// const uploadLabPDF = require('../middleware/uploadLabFiles');
// const {
//   uploadLabCourseFile,
//   getLabCourseFiles
// } = require('../controllers/labCourseFileController');

// // ✅ FIXED IMPORT
// const PDFMerger = require('pdf-merger-js').default;

// /* ======================================================
//    UPLOAD SINGLE PDF
// ====================================================== */
// router.post(
//   '/lab-course-files/upload',
//   uploadLabPDF.single('file'),
//   uploadLabCourseFile
// );

// /* ======================================================
//    GET FILES BY OFFERING
// ====================================================== */
// router.get('/lab-course-files/:offering_id', getLabCourseFiles);

// /* ======================================================
//    MERGE MULTIPLE PDFs
// ====================================================== */
// router.post('/lab-course-files/merge-pdf', async (req, res) => {
//   try {
//     const { files } = req.body;
//     console.log("FILES RECEIVED FOR MERGE:", files);

//     if (!files || !Array.isArray(files) || files.length === 0) {
//       return res.status(400).json({ message: "No files provided for merge" });
//     }

//     const merger = new PDFMerger();

//     for (let file of files) {
//       const fullPath = path.join(__dirname, '../', file);

//       if (!fs.existsSync(fullPath)) {
//         return res.status(404).json({ message: `File not found: ${file}` });
//       }

//       await merger.add(fullPath);
//     }

//     const mergedFileName = `merged_${Date.now()}.pdf`;
//     const mergedRelativePath = `uploads/${mergedFileName}`;
//     const mergedAbsolutePath = path.join(__dirname, '../', mergedRelativePath);

//     await merger.save(mergedAbsolutePath);

//     res.json({
//       success: true,
//       mergedFile: mergedRelativePath
//     });

//   } catch (error) {
//     console.error("PDF MERGE ERROR:", error);
//     res.status(500).json({
//       message: "PDF merge failed",
//       error: error.message
//     });
//   }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');


const { dbPool } = require('../config/db');

const uploadLabPDF = require('../middleware/uploadLabFiles');
const {
  uploadLabCourseFile,
  getLabCourseFiles
} = require('../controllers/labCourseFileController');

router.post(
  '/lab-course-files/upload',
  uploadLabPDF.single('file'),
  uploadLabCourseFile
);

router.get('/lab-course-files/:offering_id', getLabCourseFiles);


/* ✅ MERGE + SAVE TO DATABASE */
router.post('/lab-course-files/merge-pdf', async (req, res) => {
  try {
    const { default: PDFMerger } = await import('pdf-merger-js');

    const { files, offering_id, faculty_id } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files provided" });
    }

    const merger = new PDFMerger();

    for (let file of files) {
      const fullPath = path.resolve(file);

      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ message: `File not found: ${file}` });
      }

      await merger.add(fullPath);
    }

    const mergedFileName = `merged_${Date.now()}.pdf`;
    const mergedPath = path.join(__dirname, '../uploads/lab-course-files', mergedFileName);

    await merger.save(mergedPath);

    const [result] = await dbPool.query(
      `INSERT INTO lab_course_files (offering_id, faculty_id, file_name, file_path)
       VALUES (?, ?, ?, ?)`,
      [offering_id, faculty_id, mergedFileName, mergedPath]
    );

    res.json({
      success: true,
      message: "PDFs merged and saved successfully",
      file_id: result.insertId,
      mergedFileURL: `/uploads/lab-course-files/${mergedFileName}`
    });

  } catch (error) {
    console.error("PDF MERGE ERROR:", error);
    res.status(500).json({
      message: "PDF merge failed",
      error: error.message
    });
  }
});



module.exports = router;
