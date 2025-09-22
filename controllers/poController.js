const { dbPool } = require('../config/db');

// Get all POs for a department
exports.getPOs = async (req, res) => {
  const deptId = req.params.deptId;
  try {
    const [rows] = await dbPool.query('SELECT * FROM po WHERE dept_id = ?', [deptId]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching POs:', err);
    res.status(500).json({ error: 'Failed to fetch POs' });
  }
};

// Add new PO
exports.createPO = async (req, res) => {
  const { dept_id, po_no, title, description } = req.body;
  try {
    const [result] = await dbPool.query(
      'INSERT INTO po (dept_id, po_no, title, description) VALUES (?, ?, ?, ?)',
      [dept_id, po_no, title, description]
    );
    res.json({ po_id: result.insertId });
  } catch (err) {
    console.error('Error creating PO:', err);
    res.status(500).json({ error: 'Failed to create PO' });
  }
};

// Update existing PO
exports.updatePO = async (req, res) => {
  const poId = req.params.id;
  const { po_no, title, description } = req.body;
  try {
    await dbPool.query(
      'UPDATE po SET po_no = ?, title = ?, description = ? WHERE po_id = ?',
      [po_no, title, description, poId]
    );
    res.json({ message: 'PO updated successfully' });
  } catch (err) {
    console.error('Error updating PO:', err);
    res.status(500).json({ error: 'Failed to update PO' });
  }
};

// Delete PO
exports.deletePO = async (req, res) => {
  const poId = req.params.id;
  try {
    await dbPool.query('DELETE FROM po WHERE po_id = ?', [poId]);
    res.json({ message: 'PO deleted successfully' });
  } catch (err) {
    console.error('Error deleting PO:', err);
    res.status(500).json({ error: 'Failed to delete PO' });
  }
};



const { dbPool } = require('../config/db'); // use promise-based pool

// Get all courses with their departments
const getCoursesWithDept = async (req, res) => {
  try {
    const [rows] = await dbPool.query(`
      SELECT 
          c.course_id,
          c.code AS course_code,
          c.name AS course_name,
          MIN(d.dept_id) AS dept_id,
          MIN(d.name) AS dept_name
      FROM course c
      JOIN schema_course sc ON sc.course_id = c.course_id
      JOIN schema_table st ON st.schema_id = sc.schema_id
      JOIN program p ON p.program_id = st.program_id
      JOIN dept d ON d.dept_id = p.dept_id
      GROUP BY c.course_id, c.code, c.name
      ORDER BY c.course_id;
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching courses with department:', err);
    res.status(500).json({ error: 'Failed to fetch courses with department' });
  }
};

module.exports = {
  getCoursesWithDept,
};
