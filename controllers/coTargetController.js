const { dbPool } = require('../config/db');

// ======================
// GET all CO/Class targets
// ======================
const getCoTargets = async (req, res) => {
  try {
    const [rows] = await dbPool.query('SELECT * FROM co_class_targets');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ======================
// GET single CO/Class target by ID
// ======================
const getCoTargetById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await dbPool.query('SELECT * FROM co_class_targets WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'CO/Class target not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ======================
// UPSERT CO/Class target
// ======================


// UPSERT CO/Class target (insert or update)


// UPSERT
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
      indirect
    } = req.body;

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
        indirect = VALUES(indirect)
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

    res.json({ message: "CO/Class target saved successfully" });

  } catch (err) {
    console.error("UPSERT ERROR:", err);
    res.status(500).json({ error: "Error saving CO/Class target" });
  }
};







// ======================
// OPTIONAL: create new (strict insert)
// ======================
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

    res.status(201).json({ message: 'CO/Class target created', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ======================
// UPDATE existing CO/Class target
// ======================
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
        score1 = ?, score2 = ?, score3 = ?, direct = ?, indirect = ?, updated_at = NOW()
        WHERE id = ?`,
      [department_id, batch_id, co_target, class_target, score1, score2, score3, direct, indirect, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: 'CO/Class target not found' });

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
  saveCoTarget, // Upsert
};
