// routes/semRouter.js
const express = require('express');
const router = express.Router();
const { getAllSemesters } = require('../controllers/semController');

// GET /sem
router.get('/', getAllSemesters);

module.exports = router;

