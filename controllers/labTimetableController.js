const { db } = require('../config/db');
const path = require('path');
const fs = require('fs');

// 📥 Upload Lab Timetable
exports.uploadLabTimetable = (req, res) => {
  const { course_id, faculty_id } = req.body;
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileName = req.file.filename;
  const filePath = path.join('uploads', 'lab_timetables', fileName);

  const query = `
    INSERT INTO lab_timetable (course_id, file_name, file_path, uploaded_by)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [course_id, fileName, filePath, faculty_id], (err, result) => {
    if (err) {
      console.error('❌ Error saving lab timetable:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(201).json({
      message: '✅ Lab timetable uploaded successfully',
      lab_timetable_id: result.insertId,
      file_name: fileName,
      file_path: filePath,
    });
  });
};

// 📤 Get All Lab Timetables for a Course
exports.getLabTimetablesByCourse = (req, res) => {
  const { courseId } = req.params;

  const query = `
    SELECT 
      lab_timetable_id,
      file_name,
      CONCAT('/uploads/lab_timetables/', file_name) AS url,
      uploaded_at
    FROM lab_timetable
    WHERE course_id = ?
    ORDER BY uploaded_at DESC
  `;

  db.query(query, [courseId], (err, results) => {
    if (err) {
      console.error('❌ Error fetching lab timetables:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(200).json({
      message: '✅ Lab timetables fetched successfully',
      labTimetables: results,
    });
  });
};

// 🗑️ Delete a Lab Timetable
exports.deleteLabTimetable = (req, res) => {
  const { id } = req.params;

  const selectQuery = `SELECT file_path FROM lab_timetable WHERE lab_timetable_id = ?`;

  db.query(selectQuery, [id], (err, results) => {
    if (err) {
      console.error('❌ Error finding file:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = path.join(__dirname, '..', results[0].file_path);

    // Delete from DB first
    const deleteQuery = `DELETE FROM lab_timetable WHERE lab_timetable_id = ?`;
    db.query(deleteQuery, [id], (err) => {
      if (err) {
        console.error('❌ Error deleting DB record:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      // Delete actual file (ignore missing files)
      fs.unlink(filePath, (fsErr) => {
        if (fsErr && fsErr.code !== 'ENOENT') {
          console.error('⚠️ File deletion error:', fsErr);
        }
      });

      res.status(200).json({ message: '✅ Lab timetable deleted successfully' });
    });
  });
};
