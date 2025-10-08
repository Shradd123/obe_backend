const { dbPool } = require('../config/db');

// ✅ Get all experiments for a given offering_id
const getLabSyllabus = async (req, res) => {
  try {
    const { offering_id } = req.params;

    if (!offering_id) {
      return res.status(400).json({ message: 'Offering ID is required' });
    }

    const [rows] = await dbPool.query(
      `SELECT id, exp_no AS expNo, statement, blooms_level AS blooms
       FROM lab_syllabus
       WHERE offering_id = ?
       ORDER BY exp_no ASC`,
      [offering_id]
    );

    res.json(rows);
  } catch (err) {
    console.error('Error fetching Lab Syllabus:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Save or update experiments for an offering
const saveLabSyllabus = async (req, res) => {
  const connection = await dbPool.getConnection();
  try {
    const { offering_id } = req.params;
    const { experiments } = req.body; // frontend sends [{expNo, statement, blooms}, ...]

    if (!offering_id) {
      return res.status(400).json({ message: 'Offering ID is required' });
    }

    if (!Array.isArray(experiments)) {
      return res.status(400).json({ message: 'Experiments must be an array' });
    }

    await connection.beginTransaction();

    // Remove existing syllabus for the offering before inserting fresh data
    await connection.query(`DELETE FROM lab_syllabus WHERE offering_id = ?`, [offering_id]);

    // Insert each experiment
    for (const exp of experiments) {
      await connection.query(
        `INSERT INTO lab_syllabus (offering_id, exp_no, statement, blooms_level)
         VALUES (?, ?, ?, ?)`,
        [offering_id, exp.expNo, exp.statement, exp.blooms]
      );
    }

    await connection.commit();
    res.json({ message: 'Lab Syllabus saved successfully' });
  } catch (err) {
    await connection.rollback();
    console.error('Error saving Lab Syllabus:', err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
};

module.exports = {
  getLabSyllabus,
  saveLabSyllabus,
};
