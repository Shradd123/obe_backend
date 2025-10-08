const { db } = require("../config/db");


const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ===== MULTER CONFIG =====
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/student_lists");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "studentlist-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ===== Upload PDF or Manual List =====
const uploadStudentList = (req, res) => {
  try {
    const { offering_id, batch_name, uploaded_by, students } = req.body;

    // Case 1️⃣: If PDF is uploaded
    if (req.file) {
      const file_name = req.file.filename;
      const file_path = `uploads/student_lists/${file_name}`;

      db.query(
        `INSERT INTO student_list (offering_id, batch_name, file_name, file_path, uploaded_by)
         VALUES (?, ?, ?, ?, ?)`,
        [offering_id, batch_name, file_name, file_path, uploaded_by],
        (err, result) => {
          if (err) {
            console.error("Error inserting PDF list:", err);
            return res.status(500).json({ error: "Failed to save PDF list." });
          }
          return res.status(200).json({ message: "PDF uploaded successfully!" });
        }
      );

      return;
    }

    // Case 2️⃣: Manual entry (students as JSON)
    if (students) {
      const parsed = JSON.parse(students);

      db.query(
        `INSERT INTO student_list (offering_id, batch_name, uploaded_by)
         VALUES (?, ?, ?)`,
        [offering_id, batch_name, uploaded_by],
        (err, result) => {
          if (err) {
            console.error("Error inserting manual list:", err);
            return res.status(500).json({ error: "Failed to save student list." });
          }

          const student_list_id = result.insertId;
          let processed = 0;

          parsed.forEach((s) => {
            db.query(
              `INSERT INTO student_list_entries (student_list_id, sl_no, usn, name)
               VALUES (?, ?, ?, ?)`,
              [student_list_id, s.sl, s.usn, s.name],
              (err2) => {
                if (err2) console.error("Error inserting student entry:", err2);

                processed++;
                if (processed === parsed.length) {
                  return res
                    .status(200)
                    .json({ message: "Student list saved successfully!" });
                }
              }
            );
          });
        }
      );

      return;
    }

    res.status(400).json({ error: "No file or student data provided." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload student list." });
  }
};

// ===== Fetch All Lists =====
const getStudentLists = (req, res) => {
  try {
    const { offering_id } = req.params;

    db.query(
      `SELECT * FROM student_list WHERE offering_id = ? ORDER BY uploaded_at DESC`,
      [offering_id],
      (err, lists) => {
        if (err) {
          console.error("Error fetching student lists:", err);
          return res.status(500).json({ error: err.message });
        }

        if (!lists || lists.length === 0) {
          return res.status(200).json([]);
        }

        let processed = 0;

        lists.forEach((list, idx) => {
          db.query(
            `SELECT sl_no, usn, name FROM student_list_entries WHERE student_list_id = ?`,
            [list.id],
            (err2, entries) => {
              if (err2) {
                console.error("Error fetching student entries:", err2);
                list.students = [];
              } else {
                list.students = entries;
              }

              processed++;
              if (processed === lists.length) {
                res.status(200).json(lists);
              }
            }
          );
        });
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Failed to fetch student lists." });
  }
};

// ===== Delete a List =====
const deleteStudentList = (req, res) => {
  try {
    const { id } = req.params;

    db.query(
      `SELECT file_path FROM student_list WHERE id = ?`,
      [id],
      (err, results) => {
        if (err) {
          console.error("Error fetching file info:", err);
          return res.status(500).json({ error: "Failed to delete student list." });
        }

        const file = results && results[0];

        if (file && file.file_path && fs.existsSync(file.file_path)) {
          fs.unlinkSync(file.file_path);
        }

        db.query(`DELETE FROM student_list WHERE id = ?`, [id], (err2) => {
          if (err2) {
            console.error("Error deleting student list:", err2);
            return res
              .status(500)
              .json({ error: "Failed to delete student list." });
          }

          res.status(200).json({ message: "Student list deleted successfully!" });
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete student list." });
  }
};

module.exports = {
  uploadStudentList,
  getStudentLists,
  deleteStudentList,
  upload,
};
