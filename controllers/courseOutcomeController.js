const { db } = require('../config/db');

// ====================
// Get all COs for a given course
// ====================
exports.getAll = async (req, res) => {
  const course_id = Number(req.params.course_id);
  console.log('👉 Received course_id param:', req.params.course_id);
  console.log('👉 Converted course_id:', course_id);
  console.log('👉 Type of course_id:', typeof course_id);

  try {
    // Debug: show all courses in DB
    const [allCourses] = await db.query('SELECT * FROM course');
    console.log('👉 All courses in DB:', allCourses);

    // Verify course exists
    const [course] = await db.query('SELECT * FROM course WHERE course_id = ?', [course_id]);
    console.log('👉 Course check result:', course);

    if (!course.length) {
      return res.status(404).json({ message: `Course with id=${course_id} not found` });
    }

    // Fetch COs (can be empty)
    const [rows] = await db.query('SELECT * FROM course_outcome WHERE course_id = ?', [course_id]);
    console.log('👉 COs fetched:', rows);

    return res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching COs:', err);
    return res.status(500).json({ message: 'Error fetching course outcomes' });
  }
};

// ====================
// Create a new CO
// ====================
exports.create = async (req, res) => {
  const course_id = Number(req.params.course_id);
  const { coNo, description, bloomLevel } = req.body;

  console.log('👉 POST create CO for course_id:', course_id);
  console.log('👉 Body received:', req.body);

  if (!coNo || !description || !bloomLevel) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [course] = await db.query('SELECT * FROM course WHERE course_id = ?', [course_id]);
    console.log('👉 Course check result (POST):', course);

    if (!course.length) {
      return res.status(404).json({ message: `Course with id=${course_id} not found` });
    }

    const [result] = await db.query(
      `INSERT INTO course_outcome (course_id, co_no, description, bloom_level) 
       VALUES (?, ?, ?, ?)`,
      [course_id, coNo, description, bloomLevel]
    );

    return res.status(201).json({
      co_id: result.insertId,
      course_id,
      coNo,
      description,
      bloomLevel,
    });
  } catch (err) {
    console.error('❌ Error adding CO:', err);
    return res.status(500).json({ message: 'Error adding course outcome' });
  }
};

// ====================
// Update CO
// ====================
exports.update = async (req, res) => {
  const { co_id } = req.params;
  const { coNo, description, bloomLevel } = req.body;

  console.log('👉 Update CO_id:', co_id);
  console.log('👉 Body received for update:', req.body);

  if (!coNo || !description || !bloomLevel) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [result] = await db.query(
      `UPDATE course_outcome 
       SET co_no = ?, description = ?, bloom_level = ? 
       WHERE co_id = ?`,
      [coNo, description, bloomLevel, co_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Course outcome not found' });
    }

    return res.json({ message: 'Course outcome updated successfully' });
  } catch (err) {
    console.error('❌ Error updating CO:', err);
    return res.status(500).json({ message: 'Error updating course outcome' });
  }
};

// ====================
// Delete CO
// ====================
exports.remove = async (req, res) => {
  const { co_id } = req.params;
  console.log('👉 Delete CO_id:', co_id);

  try {
    const [result] = await db.query(`DELETE FROM course_outcome WHERE co_id = ?`, [co_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Course outcome not found' });
    }

    return res.json({ message: 'Course outcome deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting CO:', err);
    return res.status(500).json({ message: 'Error deleting course outcome' });
  }
};
