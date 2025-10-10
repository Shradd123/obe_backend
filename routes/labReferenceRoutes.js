// const express = require('express');
// const router = express.Router();
// const {
//   addReferenceMaterial,
//   getReferenceMaterials,
//   updateReferenceMaterial,
//   deleteReferenceMaterial
// } = require('../controllers/labReferenceController');

// // Get all reference materials for a specific offering
// router.get('/:offering_id', getReferenceMaterials);

// // Add a new reference material
// router.post('/', addReferenceMaterial);

// // Update a reference material by ID
// router.put('/:id', updateReferenceMaterial);

// // Delete a reference material by ID
// router.delete('/:id', deleteReferenceMaterial);

// module.exports = router;
const express = require("express");
const router = express.Router();
const {
  addReferenceMaterial,
  getReferenceMaterials,
  updateReferenceMaterial,
  deleteReferenceMaterial,
} = require("../controllers/labReferenceController");

// ✅ Get all reference materials for a specific offering
// Example: GET /api/lab-references/offering/101
router.get("/offering/:offering_id", getReferenceMaterials);

// ✅ Add a new reference material
// Example: POST /api/lab-references
router.post("/", addReferenceMaterial);

// ✅ Update a reference material by ID
// Example: PUT /api/lab-references/5
router.put("/:id", updateReferenceMaterial);

// ✅ Delete a reference material by ID
// Example: DELETE /api/lab-references/5
router.delete("/:id", deleteReferenceMaterial);

module.exports = router;
