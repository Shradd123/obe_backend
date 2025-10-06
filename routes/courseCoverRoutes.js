const express = require("express");
const router = express.Router();
const {
  getCourseCover,
  upsertCourseCover,
  getCourseCoverFallback,
} = require("../controllers/courseCoverController");

// GET by faculty + offering
router.get("/:facultyId/:offeringId", getCourseCover);

// UPSERT by faculty + offering
router.post("/:facultyId/:offeringId", upsertCourseCover);

// FALLBACK: offering only
router.get("/fallback/:offeringId", getCourseCoverFallback);

module.exports = router;
