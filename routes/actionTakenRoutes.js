const express = require("express");
const router = express.Router();
const { getActionTaken, saveActionTaken } = require("../controllers/actionTakenController");

router.get("/action-taken/:offering_id", getActionTaken);
router.post("/action-taken/save", saveActionTaken);

module.exports = router;
