const { dbPool } = require('../config/db');

// Save or update Lab CO–PO mapping
const saveLabCoPoMapping = async (req, res) => {
  try {
    const { offering_id, mappingData, justificationData } = req.body;

    if (!offering_id || !mappingData || !justificationData) {
      return res.status(400).json({ message: 'Missing required data' });
    }

    // Prepare insert queries
    const values = [];

    for (const co in mappingData) {
      for (const po in mappingData[co]) {
        const level = mappingData[co][po];
        const justificationEntry = justificationData[`${co}-${po}`] || {};
        const justification = justificationEntry.justification || '';
        const justLevel = justificationEntry.level || level || 0;

        values.push([offering_id, co, po, justLevel, justification]);
      }
    }

    // Save all mappings (upsert)
    const insertQuery = `
      INSERT INTO lab_co_po_mapping (offering_id, co, po, level, justification)
      VALUES ?
      ON DUPLICATE KEY UPDATE 
        level = VALUES(level),
        justification = VALUES(justification)
    `;

    await dbPool.query(insertQuery, [values]);

    res.status(200).json({ message: 'Lab CO–PO Mapping saved successfully' });
  } catch (error) {
    console.error('Error saving Lab CO–PO Mapping:', error);
    res.status(500).json({ message: 'Server error while saving mapping' });
  }
};

// Get Lab CO–PO Mapping by offering_id
const getLabCoPoMapping = async (req, res) => {
  try {
    const { offering_id } = req.params;

    if (!offering_id) {
      return res.status(400).json({ message: 'Offering ID required' });
    }

    const [rows] = await dbPool.query(
      'SELECT * FROM lab_co_po_mapping WHERE offering_id = ?',
      [offering_id]
    );

    if (!rows.length) {
      return res.status(200).json({ message: 'No mapping found', data: [] });
    }

    res.json({ data: rows });
  } catch (error) {
    console.error('Error fetching Lab CO–PO Mapping:', error);
    res.status(500).json({ message: 'Server error while fetching mapping' });
  }
};

module.exports = {
  saveLabCoPoMapping,
  getLabCoPoMapping
};
