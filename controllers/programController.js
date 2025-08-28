const { db } = require('../config/db'); // ✅ Destructure only db

const addProgram = (req, res) => {
  const { name, code, vision, missions, peos, psos, dept_id } = req.body;

  if (!dept_id) {
    return res.status(400).send('Missing dept_id in request');
  }

  db.beginTransaction((err) => {
    if (err) return res.status(500).send('Transaction error');

    db.query(
      'INSERT INTO PROGRAM (name, code, dept_id) VALUES (?, ?, ?)',
      [name, code, dept_id],
      (err, result) => {
        if (err) return db.rollback(() => res.status(500).send('Error inserting program'));

        const program_id = result.insertId;

        // Insert Vision
        db.query(
          'INSERT INTO VISION_dept (dept_id, statement) VALUES (?, ?) ON DUPLICATE KEY UPDATE statement = ?',
          [dept_id, vision, vision],
          (err) => {
            if (err) return db.rollback(() => res.status(500).send('Error inserting vision'));

            // Insert Missions
            const missionQueries = missions.map((m) => {
              return new Promise((resolve, reject) => {
                db.query(
                  'INSERT INTO MISSION_dept (dept_id, statement) VALUES (?, ?)',
                  [dept_id, m.statement],
                  (err) => (err ? reject(err) : resolve())
                );
              });
            });

            // Insert PEOs
            const peoQueries = peos.map((peo) => {
              return new Promise((resolve, reject) => {
                db.query(
                  'INSERT INTO PEO (dept_id, title, description) VALUES (?, ?, ?)',
                  [dept_id, peo.title, peo.description],
                  (err) => (err ? reject(err) : resolve())
                );
              });
            });

            // Insert PSOs
            const psoQueries = psos.map((pso) => {
              return new Promise((resolve, reject) => {
                db.query(
                  'INSERT INTO PSO (dept_id, title, description) VALUES (?, ?, ?)',
                  [dept_id, pso.title, pso.description],
                  (err) => (err ? reject(err) : resolve())
                );
              });
            });

            Promise.all([...missionQueries, ...peoQueries, ...psoQueries])
              .then(() => {
                db.commit((err) => {
                  if (err) return db.rollback(() => res.status(500).send('Commit error'));
                  res.status(200).json({ message: 'Program added successfully' });
                });
              })
              .catch((err) => {
                db.rollback(() => res.status(500).send('Insert error: ' + err.message));
              });
          }
        );
      }
    );
  });
};




// GET /api/programs/admin/:admin_id
const getProgramsByAdmin = (req, res) => {
  const adminId = req.params.admin_id;

  const sql = `
    SELECT p.program_id, p.name, p.code, p.dept_id
    FROM PROGRAM p
    JOIN dept d ON p.dept_id = d.dept_id
    WHERE d.admin_id = ?
  `;

  db.query(sql, [adminId], (err, results) => {
    if (err) {
      console.error('Error fetching programs:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
};

// GET /api/programs/:program_id/details
// GET /api/programs/:program_id/details


// controllers/programController.js
const { dbPool } = require('../config/db');

const getProgramDetails = async (req, res) => {
  const { program_id } = req.params;
  console.log('Requested program_id:', program_id);

  try {
    // 1. Fetch the program (NO destructuring mistake)
    const result = await dbPool.query('SELECT * FROM PROGRAM WHERE program_id = ?', [program_id]);
    const programRows = result[0]; // ✅ correct extraction
    console.log('Fetched program rows:', programRows);

    if (!programRows || programRows.length === 0) {
      return res.status(404).json({ error: 'Program not found' });
    }

    const program = programRows[0];
    console.log('Extracted program:', program);

    const dept_id = program.dept_id;

    // 2. Fetch related details
    const visionResult = await dbPool.query(
      'SELECT statement FROM VISION_dept WHERE dept_id = ?',
      [dept_id]
    );
    const visionRow = visionResult[0][0];

    const missionsResult = await dbPool.query(
      'SELECT statement FROM MISSION_dept WHERE dept_id = ?',
      [dept_id]
    );
    const missionRows = missionsResult[0];

    const peosResult = await dbPool.query(
      'SELECT title, description FROM PEO WHERE dept_id = ?',
      [dept_id]
    );
    const peoRows = peosResult[0];

    const psosResult = await dbPool.query(
      'SELECT title, description FROM PSO WHERE dept_id = ?',
      [dept_id]
    );
    const psoRows = psosResult[0];

    // 3. Send response
    res.status(200).json({
      program,
      vision: visionRow?.statement || '',
      missions: missionRows,
      peos: peoRows,
      psos: psoRows,
    });
  } catch (err) {
    console.error('Error in getProgramDetails:', err);
    res.status(500).json({ error: 'Failed to fetch program details' });
  }
};

module.exports = { getProgramDetails };







const getProgramsByDept = (req, res) => {
  const deptId = req.params.dept_id;

  const sql = `
    SELECT program_id, name, code, dept_id
    FROM program
    WHERE dept_id = ?
  `;

  db.query(sql, [deptId], (err, results) => {
    if (err) {
      console.error('Error fetching programs:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
};


module.exports = {
  addProgram,
  getProgramsByAdmin,
  getProgramDetails,
  getProgramsByDept,
};
