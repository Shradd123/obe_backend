const express = require("express");
const router = express.Router();
const {
  getExperiments,
  addExperiment,
  updateExperiment,
  deleteExperiment,
} = require("../controllers/labPlanExecutionController");

// ✅ Get all experiments for a specific offering
router.get("/offering/:offering_id", getExperiments);

// ✅ Add a new experiment
router.post("/", addExperiment);

// ✅ Update experiment by ID
router.put("/:id", updateExperiment);

// ✅ Delete experiment by ID
router.delete("/:id", deleteExperiment);

module.exports = router;
