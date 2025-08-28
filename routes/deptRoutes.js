const express = require('express');
const router = express.Router();
const deptController = require('../controllers/deptController');

// POST /admin/dept/create
router.post('/admin/dept/create', deptController.createDept);
router.put('/admin/dept/update/:id', deptController.update);
router.delete('/admin/dept/delete/:id', deptController.remove);


const { db } = require('../config/db'); // ✅ Destructure only db

// GET all departments
router.get('/admin/dept/all', async (req, res) => {
  try {
    const query = 'SELECT dept_id, name, code FROM dept';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.status(200).json(results);
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



const { dbPool } = require('../config/db'); // adjust path as needed

// GET /api/departments/:dept_id
router.get('/departments/:dept_id', async (req, res) => {
  const { dept_id } = req.params;

  try {
    const [rows] = await dbPool.query(
      'SELECT name FROM DEPT WHERE dept_id = ?',
      [dept_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json({ name: rows[0].name }); // ✅ Ensure response has { name: ... }
  } catch (err) {
    console.error('Database error in /departments/:dept_id:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});








module.exports = router;
