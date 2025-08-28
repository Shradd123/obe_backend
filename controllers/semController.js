// controller/semController.js
const { dbPool } = require('../config/db');

const getAllSemesters = async (req, res) => {
  try {
    const [rows] = await dbPool.query('SELECT * FROM sem');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching semesters:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllSemesters,
};
