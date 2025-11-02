






const express = require("express");
const router = express.Router();

const {
  getLabPlanExecution,
  getBatchesByOffering,
  addLabPlanExecution,
  updateLabPlanExecution,
  deleteLabPlanExecution,
} = require("../controllers/labPlanExecutionController");

// ==================================================
// 🔹 Get all lab plan & execution entries for an offering (optionally filtered by batch)
// Example: GET /api/lab-plan-execution/offering/1?batch=A1
// ==================================================
router.get("/offering/:offering_id", getLabPlanExecution);

// ==================================================
// 🔹 Get all distinct batches for a specific offering
// Example: GET /api/lab-plan-execution/batches/1
// ==================================================
router.get("/batches/:offering_id", getBatchesByOffering);

// ==================================================
// 🔹 Add new lab plan & execution entry
// Example: POST /api/lab-plan-execution
// ==================================================
router.post("/", addLabPlanExecution);

// ==================================================
// 🔹 Update a lab plan & execution entry
// Example: PUT /api/lab-plan-execution/:id
// ==================================================
router.put("/:id", updateLabPlanExecution);

// ==================================================
// 🔹 Delete a lab plan & execution entry
// Example: DELETE /api/lab-plan-execution/:id
// ==================================================
router.delete("/:id", deleteLabPlanExecution);

module.exports = router;
