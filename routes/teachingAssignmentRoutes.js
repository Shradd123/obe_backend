// routes/teachingAssignmentRoutes.js
const express = require("express");
const router = express.Router();
const {
  createAssignment,
  getAllAssignments,
  getAssignmentsByFaculty,
  deleteAssignment,
  updateAssignment,
} = require("../controllers/teachingAssignmentController");

// POST - Create or update assignment
router.post("/", createAssignment);

// GET - All assignments
router.get("/", getAllAssignments);

// GET - Assignments by faculty
router.get("/faculty/:facultyId", getAssignmentsByFaculty);

// DELETE - Assignment
router.delete("/:assignmentId", deleteAssignment);

// PUT - Update assignment
router.put("/:assignmentId", updateAssignment);

const { db } = require('../config/db');
router.get("/:batchId/:semId", async (req, res) => {
  const { batchId, semId } = req.params;

  try {
    const sql = `
      SELECT
        a.assignment_id,
        a.faculty_id,
        a.offering_id,
        a.section_id,
        a.role,
        o.course_id,
        f.name AS faculty_name,
        c.name AS course_name,
        s.name AS section_name
      FROM COURSE_TEACHING_ASSIGNMENT a
      JOIN COURSE_OFFERING o ON a.offering_id = o.offering_id
      JOIN COURSE c ON o.course_id = c.course_id
      JOIN FACULTY f ON a.faculty_id = f.faculty_id
      LEFT JOIN SECTION s ON a.section_id = s.section_id
      WHERE o.batch_id = ? AND o.sem_id = ?;
    `;

    db.query(sql, [batchId, semId], (err, results) => {
      if (err) {
        console.error("Error fetching assignments:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json(results);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;