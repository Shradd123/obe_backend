const { dbPool } = require('../config/db');



// Save or update CO/Class target (upsert)
const saveCoTarget = async (req, res) => {
  try {
    const {
      department_id,
      batch_id,
      co_target,
      class_target,
      score1,
      score2,
      score3,
      direct,
      indirect,
    } = req.body;

    // Upsert query
    const sql = `
      INSERT INTO co_class_targets
      (department_id, batch_id, co_target, class_target, score1, score2, score3, direct, indirect)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        co_target = VALUES(co_target),
        class_target = VALUES(class_target),
        score1 = VALUES(score1),
        score2 = VALUES(score2),
        score3 = VALUES(score3),
        direct = VALUES(direct),
        indirect = VALUES(indirect),
        updated_at = NOW()
    `;

    await dbPool.query(sql, [
      department_id,
      batch_id,
      co_target,
      class_target,
      score1,
      score2,
      score3,
      direct,
      indirect,
    ]);

    res.json({ message: "CO/Class target saved successfully (upsert)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { saveCoTarget };





// GET all CO/Class targets
const getCoTargets = async (req, res) => {
  try {
    const [rows] = await dbPool.query('SELECT * FROM co_class_targets');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET single CO/Class target by ID
const getCoTargetById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await dbPool.query('SELECT * FROM co_class_targets WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'CO/Class target not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST create new CO/Class target
const createCoTarget = async (req, res) => {
  const {
    department_id,
    batch_id,
    co_target,
    class_target,
    score1,
    score2,
    score3,
    direct,
    indirect,
  } = req.body;

  try {
    const [result] = await dbPool.query(
      `INSERT INTO co_class_targets
      (department_id, batch_id, co_target, class_target, score1, score2, score3, direct, indirect)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [department_id, batch_id, co_target, class_target, score1, score2, score3, direct, indirect]
    );

    const insertedId = result.insertId;
    res.status(201).json({ message: 'CO/Class target created', id: insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT update existing CO/Class target
const updateCoTarget = async (req, res) => {
  const { id } = req.params;
  const {
    department_id,
    batch_id,
    co_target,
    class_target,
    score1,
    score2,
    score3,
    direct,
    indirect,
  } = req.body;

  try {
    const [result] = await dbPool.query(
      `UPDATE co_class_targets SET
        department_id = ?, batch_id = ?, co_target = ?, class_target = ?,
        score1 = ?, score2 = ?, score3 = ?, direct = ?, indirect = ?
        WHERE id = ?`,
      [department_id, batch_id, co_target, class_target, score1, score2, score3, direct, indirect, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'CO/Class target not found' });
    }

    res.json({ message: 'CO/Class target updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCoTargets,
  getCoTargetById,
  createCoTarget,
  updateCoTarget,
  saveCoTarget,
};
