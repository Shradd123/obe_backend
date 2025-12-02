const express = require('express');
const router = express.Router();
const {
  getCoTargets,
  createCoTarget,
  updateCoTarget,
  getCoTargetById,
  saveCoTarget,
} = require('../controllers/coTargetController');



// POST save or update CO/Class target
router.post("/co-target", saveCoTarget);

// Get all CO/Class targets
router.get('/', getCoTargets);

// Get single CO/Class target by ID
router.get('/:id', getCoTargetById);

// Create new CO/Class target
router.post('/', createCoTarget);

// Update existing CO/Class target
router.put('/:id', updateCoTarget);

module.exports = router;



