// routes/sectionRoutes.js
const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/sectionController');

router.get('/batch/:batchId', sectionController.getSectionsByBatch);
router.post('/', sectionController.createSections);

router.get('/', sectionController.getSectionsAll);


module.exports = router;
