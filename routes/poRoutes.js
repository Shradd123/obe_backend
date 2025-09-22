// routes/poRoutes.js
const express = require("express");
const router = express.Router();
const poController = require("../controllers/poController");

// ✅ Fetch all POs by dept_id
router.get("/department/:dept_id", poController.getPOsByDepartment);

// ✅ Create PO
router.post("/", poController.createPO);

// ✅ Update PO
router.put("/:id", poController.updatePO);

// ✅ Delete PO
router.delete("/:id", poController.deletePO);

module.exports = router;
