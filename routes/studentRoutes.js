// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

const { dbPool } = require("../config/db");
//const { getStudentsByOffering } = require('../controllers/studentController');

// Route: GET /api/students/offering/:offering_id
// router.get('/offering/:offering_id', studentController.getStudentsByOffering);
router.get('/offering', studentController.getStudentsByOffering);


router.get('/section/:sectionId', studentController.getStudentsBySection);
router.post('/', studentController.addStudent);


// GET students by offering, faculty, and section
router.get("/students/by-section", async (req, res) => {
  try {
    // Accept both camelCase and snake_case and fix encoding issue
    const offeringId = req.query.offeringId || req.query.offering_id;
    const facultyId = req.query.facultyId || req.query.faculty_id;
    const sectionName =
      req.query.sectionName ||
      req.query.section ||
      req.query["§section"]; // fallback for encoding glitch

    if (!offeringId || !facultyId || !sectionName) {
      return res.status(400).json({
        error: "Missing required query parameters: offeringId, facultyId, sectionName",
      });
    }

    const query = `
      SELECT
        s.student_id,
        s.name AS student_name,
        s.usn,
        s.email,
        sec.section_id,
        sec.name AS section_name,
        b.batch_id,
        b.name AS batch_name,
        co.offering_id
      FROM student s
      JOIN section sec ON s.section_id = sec.section_id
      JOIN course_teaching_assignment cta ON cta.section_id = sec.section_id
      JOIN course_offering co ON cta.offering_id = co.offering_id
      JOIN batch b ON co.batch_id = b.batch_id
      WHERE co.offering_id = ?
        AND cta.faculty_id = ?
        AND sec.name = ?;
    `;

    const [rows] = await dbPool.query(query, [offeringId, facultyId, sectionName]);

    return res.status(200).json(rows);

  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});




module.exports = router; // ✅ Export the router, not an object