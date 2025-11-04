const express = require("express");
const router = express.Router();
const {
  getTextbookReferences,
  saveTextbookReferences
} = require("../controllers/textbookReferencesController");

router.get("/:offering_id", getTextbookReferences);
router.post("/:offering_id", saveTextbookReferences);

module.exports = router;
