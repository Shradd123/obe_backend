const { dbPool } = require('../config/db');

// ====================
// Get all COs for a given offering
// ====================
exports.getAll = async (req, res) => {
  const offering_id = Number(req.params.offering_id);
  console.log('👉 Received offering_id param:', offering_id);

  try {
    // Verify offering exists
    const [offering] = await dbPool.query(
      'SELECT * FROM course_offering WHERE offering_id = ?',
      [offering_id]
    );
    console.log('👉 Offering check result:', offering);

    if (!offering.length) {
      return res.status(404).json({ message: `Offering with id=${offering_id} not found` });
    }

    // Fetch COs for this offering
    const [rows] = await dbPool.query(
      'SELECT co_id, co_no AS coNo, description, bloom_level AS bloomLevel FROM course_outcome WHERE offering_id = ?',
      [offering_id]
    );
    console.log('👉 COs fetched:', rows);

    return res.json(rows); // returns [] if none
  } catch (err) {
    console.error('❌ Error fetching COs:', err);
    return res.status(500).json({ message: 'Error fetching course outcomes' });
  }
};

// ====================
// Create a new CO
// ====================
exports.create = async (req, res) => {
  const offering_id = Number(req.params.offering_id);
  const { coNo, description, bloomLevel } = req.body;

  console.log('👉 POST create CO for offering_id:', offering_id);
  console.log('👉 Body received:', req.body);

  if (!coNo || !description || !bloomLevel) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [offering] = await dbPool.query(
      'SELECT * FROM course_offering WHERE offering_id = ?',
      [offering_id]
    );
    if (!offering.length) {
      return res.status(404).json({ message: `Offering with id=${offering_id} not found` });
    }

    const [result] = await dbPool.query(
      `INSERT INTO course_outcome (offering_id, co_no, description, bloom_level) 
       VALUES (?, ?, ?, ?)`,
      [offering_id, coNo, description, bloomLevel]
    );

    return res.status(201).json({
      co_id: result.insertId,
      offering_id,
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
    const [result] = await dbPool.query(
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
    const [result] = await dbPool.query(
      `DELETE FROM course_outcome WHERE co_id = ?`,
      [co_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Course outcome not found' });
    }

    return res.json({ message: 'Course outcome deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting CO:', err);
    return res.status(500).json({ message: 'Error deleting course outcome' });
  }
};
