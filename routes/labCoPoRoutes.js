const express = require('express');
const router = express.Router();
const {
  saveLabCoPoMapping,
  getLabCoPoMapping
} = require('../controllers/labCoPoController');

// POST - Save mapping
router.post('/lab-co-po-mapping', saveLabCoPoMapping);

// GET - Fetch mapping by offering_id
router.get('/lab-co-po-mapping/:offering_id', getLabCoPoMapping);

module.exports = router;
