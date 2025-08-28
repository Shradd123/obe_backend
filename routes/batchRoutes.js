// routes/batchRoutes.js
const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');

// CRUD for batches
router.get('/', batchController.getAllBatches);
router.get('/:batchId', batchController.getBatchById);
router.post('/', batchController.createBatch);
router.get('/latest', batchController.getLatestBatch);

const { db } = require('../config/db');

router.post("/assign-scheme", async (req, res) => {
  const { batchId, schemaId } = req.body;
  try {
    const result = await db.query(
      "UPDATE batch SET schema_id = ? WHERE batch_id = ?",
      [schemaId, batchId]
    );
    res.status(200).json({ message: "Scheme assigned successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to assign scheme" });
  }
});


router.get('/:batchId/courses', batchController.getCoursesByBatch);


module.exports = router;
