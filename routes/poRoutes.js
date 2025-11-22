const express = require("express");
const router = express.Router();
const poController = require("../controllers/poController");

// ✅ Fetch POs and PSOs by courseId
router.get("/course/:offering_id", poController.getPOsByCourse);

// ✅ CRUD for PO
router.post("/", poController.createPO);
router.put("/:id", poController.updatePO);
router.delete("/:id", poController.deletePO);
router.get("/po/course/:courseId", poController.getPOsAndPSOsByCourse);

module.exports = router;
