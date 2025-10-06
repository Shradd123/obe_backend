const { dbPool } = require('../config/db');

// Get Vision & Mission for a course offering
const getVisionAndMission = async (req, res) => {
  try {
    const { offering_id } = req.params;
    if (!offering_id) {
      return res.status(400).json({ message: 'Offering ID is required' });
    }

    // ✅ Fetch dept via offering → course → schema_course → schema_table → program → dept
    const [courseRows] = await dbPool.query(
      `SELECT MIN(d.dept_id) AS dept_id
       FROM course_offering co
       JOIN course c ON c.course_id = co.course_id
       JOIN schema_course sc ON sc.course_id = c.course_id
       JOIN schema_table st ON st.schema_id = sc.schema_id
       JOIN program p ON p.program_id = st.program_id
       JOIN dept d ON d.dept_id = p.dept_id
       WHERE co.offering_id = ?
       LIMIT 1`,
      [offering_id]
    );

    if (!courseRows.length || !courseRows[0].dept_id) {
      return res.status(404).json({ message: 'Course offering not found or not linked to a department' });
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
    const missions = missionRows.length
      ? missionRows.map(row => ({ statement: row.statement }))
      : [];

    res.json({ vision, missions });
  } catch (err) {
    console.error('Error fetching vision & mission:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getVisionAndMission };
