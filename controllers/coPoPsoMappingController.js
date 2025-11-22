// const { db } = require('../config/db');

// // Get course outcomes by offering_id
// exports.getCourseOutcomes = (req, res) => {
//     const { offeringId } = req.params;
//     const query = `SELECT co_id, co_no, description FROM course_outcome WHERE offering_id = ?`;
//     db.query(query, [offeringId], (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json(results);
//     });
// };

// // Get POs for a department
// exports.getPOs = (req, res) => {
//     const { deptId } = req.params;
//     const query = `SELECT po_id, po_no, title FROM po WHERE dept_id = ?`;
//     db.query(query, [deptId], (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json(results);
//     });
// };

// // Get PSOs for a department
// exports.getPSOs = (req, res) => {
//     const { deptId } = req.params;
//     const query = `SELECT pso_id, title FROM pso WHERE dept_id = ?`;
//     db.query(query, [deptId], (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json(results);
//     });
// };

// // Get existing CO-PO-PSO mappings by offering_id
// exports.getMappings = (req, res) => {
//     const { offeringId } = req.params;
//     const query = `SELECT * FROM co_po_pso_mapping WHERE offering_id = ?`;
//     db.query(query, [offeringId], (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json(results);
//     });
// };

// // Save/update mappings by offering_id
// exports.saveMappings = (req, res) => {
//     const { offeringId } = req.params;
//     const mappings = req.body; // expect array of {co_id, po_id, pso_id, weight, justification}

//     if (!Array.isArray(mappings)) return res.status(400).json({ error: 'Invalid payload' });

//     // Delete existing mappings first
//     db.query(`DELETE FROM co_po_pso_mapping WHERE offering_id = ?`, [offeringId], (err) => {
//         if (err) return res.status(500).json({ error: err.message });

//         // Insert new mappings
//         const values = mappings.map(m => [
//             offeringId,
//             m.co_id || null,
//             m.po_id || null,
//             m.pso_id || null,
//             m.weight || 0,
//             m.justification || ''
//         ]);

//         if (values.length === 0) return res.json({ message: 'Mappings saved' });

//         const insertQuery = `INSERT INTO co_po_pso_mapping (offering_id, co_id, po_id, pso_id, weight, justification) VALUES ?`;
//         db.query(insertQuery, [values], (err) => {
//             if (err) return res.status(500).json({ error: err.message });
//             res.json({ message: 'Mappings saved successfully' });
//         });
//     });
// };




// const { db } = require('../config/db');

// // Get COs by offering_id
// exports.getCourseOutcomes = (req, res) => {
//   const { offering_id } = req.params;
//   const query = `SELECT co_id, co_no, description FROM course_outcome WHERE offering_id = ?`;
//   db.query(query, [offering_id], (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(results);
//   });
// };

// // Get POs for a department
// exports.getPOs = (req, res) => {
//   const { deptId } = req.params;
//   const query = `SELECT po_id, po_no, title FROM po WHERE dept_id = ?`;
//   db.query(query, [deptId], (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(results);
//   });
// };

// // Get PSOs for a department
// exports.getPSOs = (req, res) => {
//   const { deptId } = req.params;
//   const query = `SELECT pso_id, title FROM pso WHERE dept_id = ?`;
//   db.query(query, [deptId], (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(results);
//   });
// };

// // Get existing CO-PO-PSO mappings by offering_id
// exports.getMappings = (req, res) => {
//   const { offeringId } = req.params;
//   const query = `SELECT * FROM co_po_pso_mapping WHERE offering_id = ?`;
//   db.query(query, [offeringId], (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(results);
//   });
// };

// // Save/update mappings
// exports.saveMappings = (req, res) => {
//   const { offeringId } = req.params;
//   const mappings = req.body; // expect array of {co_id, po_id, pso_id, weight, justification}

//   if (!Array.isArray(mappings)) return res.status(400).json({ error: 'Invalid payload' });

//   // Delete existing mappings
//   db.query(`DELETE FROM co_po_pso_mapping WHERE offering_id = ?`, [offeringId], (err) => {
//     if (err) return res.status(500).json({ error: err.message });

//     if (mappings.length === 0) return res.json({ message: 'Mappings saved' });

//     const values = mappings.map(m => [
//       offeringId,
//       m.co_id || null,
//       m.po_id || null,
//       m.pso_id || null,
//       m.weight || 0,
//       m.justification || ''
//     ]);

//     const insertQuery = `
//       INSERT INTO co_po_pso_mapping (offering_id, co_id, po_id, pso_id, weight, justification)
//       VALUES ?
//     `;
//     db.query(insertQuery, [values], (err) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json({ message: 'Mappings saved successfully' });
//     });
//   });
// };








const { db } = require('../config/db');

// ======================================================
// 1️⃣ Get COs by offering_id
// ======================================================
exports.getCourseOutcomes = (req, res) => {
  const { offering_id } = req.params;
  const query = `
    SELECT co_id, co_no, description 
    FROM course_outcome 
    WHERE offering_id = ?
  `;
  db.query(query, [offering_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ======================================================
// 2️⃣ Get POs by offering_id  ✅ (auto-detect dept from offering)
// ======================================================


exports.getPOs = (req, res) => {
  const { offering_id } = req.params;

  const query = `
    SELECT po.po_id, po.po_no, po.title
    FROM po
    JOIN course_offering co ON co.offering_id = ?
    JOIN course c ON c.course_id = co.course_id
    ORDER BY po.po_no;
  `;

  db.query(query, [offering_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};



// ======================================================
// 3️⃣ Get PSOs by offering_id  ✅ (auto-detect dept from offering)
// ======================================================


exports.getPSOs = (req, res) => {
  const { offering_id } = req.params;

  const query = `
    SELECT pso.pso_id, pso.title, pso.description
    FROM pso
    JOIN course_offering co ON co.offering_id = ?
    JOIN course c ON c.course_id = co.course_id
    ORDER BY pso.pso_id;
  `;

  db.query(query, [offering_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ======================================================
// 4️⃣ Get existing CO–PO–PSO mappings by offering_id
// ======================================================
exports.getMappings = (req, res) => {
  const { offering_id } = req.params;

  const query = `
    SELECT * 
    FROM co_po_pso_mapping 
    WHERE offering_id = ?
  `;

  db.query(query, [offering_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// ======================================================
// 5️⃣ Save/Update CO–PO–PSO Mappings
// ======================================================
exports.saveMappings = (req, res) => {
  const { offering_id } = req.params;
  const mappings = req.body; // Expect array of {co_id, po_id, pso_id, weight, justification}

  if (!Array.isArray(mappings)) {
    return res.status(400).json({ error: 'Invalid payload format' });
  }

  // Step 1: Delete existing mappings for this offering
  const deleteQuery = `DELETE FROM co_po_pso_mapping WHERE offering_id = ?`;
  db.query(deleteQuery, [offering_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    if (mappings.length === 0) {
      return res.json({ message: 'Mappings cleared successfully' });
    }

    // Step 2: Insert updated mappings
    const values = mappings.map(m => [
      offering_id,
      m.co_id || null,
      m.po_id || null,
      m.pso_id || null,
      m.weight || 0,
      m.justification || ''
    ]);

    const insertQuery = `
      INSERT INTO co_po_pso_mapping (offering_id, co_id, po_id, pso_id, weight, justification)
      VALUES ?
    `;

    db.query(insertQuery, [values], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Mappings saved successfully' });
    });
  });
};
