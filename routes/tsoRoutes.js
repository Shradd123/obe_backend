const express = require("express");
const router = express.Router();
const {
  getCourseData,
  saveCourseInfo,
  addModule,
} = require("../controllers/tsoController");

// ✅ Get course + TSO data
router.get("/:offering_id", getCourseData);

// ✅ Save or update TSO course info
router.post("/save", saveCourseInfo);

// ✅ Add new module + nested details
router.post("/add-module", addModule);

module.exports = router;
