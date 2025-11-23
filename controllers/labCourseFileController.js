const { dbPool } = require('../config/db');

exports.uploadLabCourseFile = async (req, res) => {
  try {
    const { offering_id, faculty_id } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileName = req.file.originalname;
    const filePath = req.file.path;

    const [result] = await dbPool.query(
      `INSERT INTO lab_course_files (offering_id, faculty_id, file_name, file_path)
       VALUES (?, ?, ?, ?)`,
      [offering_id, faculty_id, fileName, filePath]
    );

    res.status(201).json({
      message: 'PDF uploaded successfully',
      file_id: result.insertId,
      fileName,
      filePath
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Server error while uploading PDF' });
  }
};


exports.getLabCourseFiles = async (req, res) => {
  try {
    const { offering_id } = req.params;

    const [rows] = await dbPool.query(
      `SELECT file_id, file_name, file_path, uploaded_at
       FROM lab_course_files
       WHERE offering_id = ?
       ORDER BY uploaded_at DESC`,
      [offering_id]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch files' });
  }
};
