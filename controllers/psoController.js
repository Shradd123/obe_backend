const { dbPool } = require('../config/db');


exports.getPSOsByOfferingId = async (req, res) => {
  const { offering_id } = req.params;

  if (!offering_id) {
    return res.status(400).json({ message: 'offering_id is required' });
  }

  const query = `
    SELECT DISTINCT pso.pso_id, pso.title, pso.description
    FROM course_offering co
    JOIN schema_course sc ON sc.course_id = co.course_id
    JOIN schema_table st ON st.schema_id = sc.schema_id
    JOIN program pr ON pr.program_id = st.program_id
    JOIN pso ON pso.dept_id = pr.dept_id
    WHERE co.offering_id = ?
  `;

  try {
    const [rows] = await dbPool.query(query, [offering_id]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching PSOs:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
