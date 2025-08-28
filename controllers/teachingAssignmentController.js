// controllers/teachingAssignmentController.js
const { dbPool } = require("../config/db");

// ✅ Create or update teaching assignment with role conflict resolution
const createAssignment = async (req, res) => {
  const { faculty_id, offering_id, section_id, role } = req.body;

  try {
    // Check for an existing assignment for the same faculty, offering, and section
    const [existingAssignments] = await dbPool.query(
      `SELECT * FROM COURSE_TEACHING_ASSIGNMENT WHERE faculty_id = ? AND offering_id = ? AND section_id = ?`,
      [faculty_id, offering_id, section_id]
    );

    const existingAssignment = existingAssignments[0];

    // If the request is to assign a Coordinator
    if (role === 'coordinator') {
      if (existingAssignment) {
        // If an assignment exists, update its role to 'coordinator'
        await dbPool.query(
          `UPDATE COURSE_TEACHING_ASSIGNMENT SET role = 'coordinator' WHERE assignment_id = ?`,
          [existingAssignment.assignment_id]
        );
        res.status(200).json({
          message: "Assignment updated to coordinator successfully",
          assignment_id: existingAssignment.assignment_id,
        });
      } else {
        // No existing assignment, so create a new one as coordinator
        const [result] = await dbPool.query(
          `INSERT INTO COURSE_TEACHING_ASSIGNMENT (faculty_id, offering_id, section_id, role) VALUES (?, ?, ?, ?)`,
          [faculty_id, offering_id, section_id, role]
        );
        res.status(201).json({
          message: "New coordinator assignment created successfully",
          assignment_id: result.insertId,
        });
      }
    } 
    // If the request is to assign an Instructor
    else if (role === 'instructor') {
      if (existingAssignment && existingAssignment.role === 'coordinator') {
        // Reject if a coordinator assignment already exists
        return res.status(409).json({ error: "Cannot assign as instructor. Faculty is already the coordinator." });
      }
      
      if (existingAssignment && existingAssignment.role === 'instructor') {
        // Do nothing if the instructor assignment already exists
        return res.status(200).json({ message: "Instructor assignment already exists." });
      }

      // No existing coordinator or instructor, so create a new instructor assignment
      const [result] = await dbPool.query(
        `INSERT INTO COURSE_TEACHING_ASSIGNMENT (faculty_id, offering_id, section_id, role) VALUES (?, ?, ?, ?)`,
        [faculty_id, offering_id, section_id, role]
      );
      res.status(201).json({
        message: "New instructor assignment created successfully",
        assignment_id: result.insertId,
      });
    }

  } catch (err) {
    console.error("Error creating/updating assignment:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// ✅ Get all assignments
const getAllAssignments = async (req, res) => {
  try {
    const [rows] = await dbPool.query(
      `SELECT a.assignment_id, f.name AS faculty_name, c.name AS course_name, 
              s.name AS section_name, a.role
       FROM COURSE_TEACHING_ASSIGNMENT a
       JOIN FACULTY f ON a.faculty_id = f.faculty_id
       JOIN COURSE_OFFERING co ON a.offering_id = co.offering_id
       JOIN COURSE c ON co.course_id = c.course_id
       JOIN SECTION s ON a.section_id = s.section_id`
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching assignments:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// ✅ Get assignments by faculty
const getAssignmentsByFaculty = async (req, res) => {
  const { facultyId } = req.params;

  try {
    const [rows] = await dbPool.query(
      `SELECT a.assignment_id, c.name AS course_name, s.name AS section_name, a.role
       FROM COURSE_TEACHING_ASSIGNMENT a
       JOIN COURSE_OFFERING co ON a.offering_id = co.offering_id
       JOIN COURSE c ON co.course_id = c.course_id
       JOIN SECTION s ON a.section_id = s.section_id
       WHERE a.faculty_id = ?`,
      [facultyId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching assignments by faculty:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// ✅ Delete assignment
const deleteAssignment = async (req, res) => {
  const { assignmentId } = req.params;

  try {
    await dbPool.query(
      `DELETE FROM COURSE_TEACHING_ASSIGNMENT WHERE assignment_id = ?`,
      [assignmentId]
    );

    res.json({ message: "Assignment deleted successfully" });
  } catch (err) {
    console.error("Error deleting assignment:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// ✅ Update assignment
const updateAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  const { faculty_id, offering_id, section_id, role } = req.body;

  try {
    // Check for a conflicting assignment (same faculty, offering, section, but different assignmentId)
    const [existingAssignments] = await dbPool.query(
      `SELECT * FROM COURSE_TEACHING_ASSIGNMENT WHERE faculty_id = ? AND offering_id = ? AND section_id = ? AND assignment_id != ?`,
      [faculty_id, offering_id, section_id, assignmentId]
    );

    if (existingAssignments.length > 0) {
      return res.status(409).json({ error: "A conflicting assignment already exists for this faculty, course, and section." });
    }

    const [result] = await dbPool.query(
      `UPDATE COURSE_TEACHING_ASSIGNMENT
       SET faculty_id = ?, offering_id = ?, section_id = ?, role = ?
       WHERE assignment_id = ?`,
      [faculty_id, offering_id, section_id, role, assignmentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json({ message: "Assignment updated successfully" });
  } catch (err) {
    console.error("Error updating assignment:", err);
    res.status(500).json({ error: "Database error" });
  }
};


module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentsByFaculty,
  deleteAssignment,
  updateAssignment,
};