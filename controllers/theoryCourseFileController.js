// const { dbPool } = require('../config/db');
// const path = require('path');
// const fs = require('fs');

// // Upload single PDF
// const uploadController = (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'No file uploaded' });
//   }

//   const filePath = `/uploads/${req.file.filename}`; // Relative URL for frontend
//   res.json({ message: 'File uploaded successfully', filePath });
// };

// // Save merged PDF info to DB
// const saveMergedPDF = async (req, res) => {
//   try {
//     const { offering_id, faculty_id, mergedFilePath } = req.body;

//     if (!offering_id || !faculty_id || !mergedFilePath) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const [result] = await dbPool.query(
//       `INSERT INTO merged_pdfs (offering_id, faculty_id, file_path) VALUES (?, ?, ?)`,
//       [offering_id, faculty_id, mergedFilePath]
//     );

//     res.json({
//       message: 'Merged PDF info saved successfully',
//       id: result.insertId,
//       file_path: mergedFilePath,
//     });
//   } catch (err) {
//     console.error('Error saving merged PDF:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get merged PDFs
// const getMergedPDFs = async (req, res) => {
//   try {
//     const { offering_id } = req.params;
//     if (!offering_id) return res.status(400).json({ message: 'Offering ID required' });

//     const [rows] = await dbPool.query(
//       `SELECT id, faculty_id, file_path, uploaded_at FROM merged_pdfs WHERE offering_id = ? ORDER BY uploaded_at DESC`,
//       [offering_id]
//     );

//     res.json({ mergedPDFs: rows });
//   } catch (err) {
//     console.error('Error fetching merged PDFs:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = { uploadController, saveMergedPDF, getMergedPDFs };

const { dbPool } = require('../config/db');
const path = require('path');
const fs = require('fs');
// const PDFMerger = require('pdf-merger-js').default; // ✅ use .default

// ==========================
// Upload single PDF
// ==========================
const uploadController = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = `/uploads/${req.file.filename}`; // Relative URL for frontend
  res.json({ message: 'File uploaded successfully', filePath });
};

// ==========================
// Merge PDFs
// ==========================
const mergePDFs = async (req, res) => {
  try {

     // ✅ Load pdf-merger-js dynamically (allowed in CommonJS)
    const { default: PDFMerger } = await import('pdf-merger-js');

    const { files, offering_id, faculty_id } = req.body;

    if (!files || !files.length) {
      return res.status(400).json({ message: 'No files provided for merge' });
    }

    // Ensure merged folder exists
    const mergedDir = path.join(__dirname, '..', 'uploads', 'theory-course-files');
    if (!fs.existsSync(mergedDir)) fs.mkdirSync(mergedDir, { recursive: true });

    const merger = new PDFMerger();

    // Loop with await to ensure proper reading
    for (const file of files) {
      const filePath = path.join(__dirname, '..', file.replace('/uploads/', 'uploads/'));
      if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        continue; // skip missing files
      }

      console.log('Adding PDF:', filePath);
      await merger.add(filePath); // ✅ await ensures proper merge
    }

    const mergedFileName = `merged-${offering_id}-${faculty_id}-${Date.now()}.pdf`;
    const mergedFilePath = path.join(mergedDir, mergedFileName);

    await merger.save(mergedFilePath); // save merged PDF

    const mergedFileURL = `/uploads/theory-course-files/${mergedFileName}`;
    res.json({ mergedFileURL });
  } catch (err) {
    console.error('Merge error:', err);
    res.status(500).json({ message: 'Failed to merge PDFs', error: err.message });
  }
};

// ==========================
// Save merged PDF info to DB
// ==========================
const saveMergedPDF = async (req, res) => {
  try {
    const { offering_id, faculty_id, mergedFilePath } = req.body;

    if (!offering_id || !faculty_id || !mergedFilePath) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const [result] = await dbPool.query(
      `INSERT INTO merged_pdfs (offering_id, faculty_id, file_path) VALUES (?, ?, ?)`,
      [offering_id, faculty_id, mergedFilePath]
    );

    res.json({
      message: 'Merged PDF info saved successfully',
      id: result.insertId,
      file_path: mergedFilePath,
    });
  } catch (err) {
    console.error('Error saving merged PDF:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==========================
// Fetch merged PDFs
// ==========================
const getMergedPDFs = async (req, res) => {
  try {
    const { offering_id } = req.params;
    if (!offering_id) return res.status(400).json({ message: 'Offering ID required' });

    const [rows] = await dbPool.query(
      `SELECT id, faculty_id, file_path, uploaded_at 
       FROM merged_pdfs 
       WHERE offering_id = ? 
       ORDER BY uploaded_at DESC`,
      [offering_id]
    );

    res.json({ mergedPDFs: rows });
  } catch (err) {
    console.error('Error fetching merged PDFs:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  uploadController,
  mergePDFs,
  saveMergedPDF,
  getMergedPDFs
};
