const { dbPool } = require('../config/db');
const path = require('path');
const fs = require('fs');

// Upload timetable (DB insert only, multer handled in middleware)
const uploadTimetable = async (req, res) => {
  try {
    const { course_id, faculty_id } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileName = req.file.originalname;
    const relativePath = `uploads/timetables/${req.file.filename}`;

    const sql = `
      INSERT INTO timetable (course_id, file_name, file_path, uploaded_by)
      VALUES (?, ?, ?, ?)
    `;

    await dbPool.query(sql, [course_id, fileName, relativePath, faculty_id]);

    res.json({ message: 'Timetable uploaded successfully', fileName, url: relativePath });
  } catch (err) {
    console.error('Error uploading timetable:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get timetable for a course
const getTimetable = async (req, res) => {
  try {
    const { course_id } = req.params;

    const sql = `
      SELECT timetable_id, file_name, file_path, uploaded_at
      FROM timetable
      WHERE course_id = ?
      ORDER BY uploaded_at DESC
    `;

    const [rows] = await dbPool.query(sql, [course_id]);

    const timetables = rows.map(row => ({
      timetable_id: row.timetable_id,
      file_name: row.file_name,
      url: row.file_path,
      uploaded_at: row.uploaded_at,
    }));

    res.json({ timetables });
  } catch (err) {
    console.error('Error fetching timetable:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete timetable
const deleteTimetable = async (req, res) => {
  try {
    const { id } = req.params;

    // Get file path from DB
    const [rows] = await dbPool.query(
      `SELECT file_path FROM timetable WHERE timetable_id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    const filePath = path.join(__dirname, '..', rows[0].file_path);

    // Delete DB record
    await dbPool.query(`DELETE FROM timetable WHERE timetable_id = ?`, [id]);

    // Delete file from disk
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: 'Timetable deleted successfully' });
  } catch (err) {
    console.error('Error deleting timetable:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { uploadTimetable, getTimetable, deleteTimetable };
