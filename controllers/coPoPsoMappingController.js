const { db } = require('../config/db'); // your mysql connection

// Get course outcomes
exports.getCourseOutcomes = (req, res) => {
    const { courseId } = req.params;
    const query = `SELECT co_id, co_no, description FROM course_outcome WHERE course_id = ?`;
    db.query(query, [courseId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Get POs for a department
exports.getPOs = (req, res) => {
    const { deptId } = req.params;
    const query = `SELECT po_id, po_no, title FROM po WHERE dept_id = ?`;
    db.query(query, [deptId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Get PSOs for a department
exports.getPSOs = (req, res) => {
    const { deptId } = req.params;
    const query = `SELECT pso_id, title FROM pso WHERE dept_id = ?`;
    db.query(query, [deptId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Get existing CO-PO-PSO mappings
exports.getMappings = (req, res) => {
    const { courseId } = req.params;
    const query = `SELECT * FROM co_po_pso_mapping WHERE course_id = ?`;
    db.query(query, [courseId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Save/update mappings
exports.saveMappings = (req, res) => {
    const { courseId } = req.params;
    const mappings = req.body; // expect array of {co_id, po_id, pso_id, weight, justification}

    if (!Array.isArray(mappings)) return res.status(400).json({ error: 'Invalid payload' });

    // Delete existing mappings first
    db.query(`DELETE FROM co_po_pso_mapping WHERE course_id = ?`, [courseId], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        // Insert new mappings
        const values = mappings.map(m => [courseId, m.co_id || null, m.po_id || null, m.pso_id || null, m.weight || 0, m.justification || '']);
        if (values.length === 0) return res.json({ message: 'Mappings saved' });

        const insertQuery = `INSERT INTO co_po_pso_mapping (course_id, co_id, po_id, pso_id, weight, justification) VALUES ?`;
        db.query(insertQuery, [values], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Mappings saved successfully' });
        });
    });
};
