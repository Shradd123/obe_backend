const { dbPool } = require('../config/db');

// Get Vision & Mission for a course (mapped via department)
const getVisionAndMission = async (req, res) => {
  try {
    const { course_id } = req.params;
    if (!course_id) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    // ✅ Correct department fetch via schema_course → schema_table → program → dept
    const [courseRows] = await dbPool.query(
      `SELECT pr.dept_id
       FROM course c
       JOIN schema_course sc ON sc.course_id = c.course_id
       JOIN schema_table st ON st.schema_id = sc.schema_id
       JOIN program pr ON pr.program_id = st.program_id
       WHERE c.course_id = ?
       LIMIT 1`,
      [course_id]
    );

    if (!courseRows.length) {
      return res.status(404).json({ message: 'Course not found or not linked to a program' });
    }

    const deptId = courseRows[0].dept_id;

    // Fetch vision
    const [visionRows] = await dbPool.query(
      'SELECT statement FROM vision_dept WHERE dept_id = ?',
      [deptId]
    );
    const vision = visionRows.length ? visionRows[0].statement : 'Vision not assigned';

    // Fetch missions
    const [missionRows] = await dbPool.query(
      'SELECT statement FROM mission_dept WHERE dept_id = ?',
      [deptId]
    );
    const missions = missionRows.length ? missionRows.map(row => ({ statement: row.statement })) : [];

    res.json({ vision, missions });
  } catch (err) {
    console.error('Error fetching vision & mission:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getVisionAndMission };
