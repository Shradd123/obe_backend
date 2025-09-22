const express = require("express");
const router = express.Router();
const poController = require("../controllers/poController");

// ✅ Fetch POs and PSOs by courseId
router.get("/course/:courseId", poController.getPOsByCourse);

// ✅ CRUD for PO
router.post("/", poController.createPO);
router.put("/:id", poController.updatePO);
router.delete("/:id", poController.deletePO);

module.exports = router;
