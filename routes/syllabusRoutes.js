// const express = require("express");
// const router = express.Router();
// const { saveSyllabus, getSyllabus } = require("../controllers/syllabusController");

// router.post("/save/:offering_id", saveSyllabus);
// router.get("/:offering_id", getSyllabus);

// module.exports = router;


const express = require("express");
const router = express.Router();

const { saveSyllabus, getSyllabus } = require("../controllers/syllabusController");

// ✅ Save syllabus
router.post("/save/:offering_id", saveSyllabus);

// ✅ Get syllabus
router.get("/:offering_id", getSyllabus);

module.exports = router;
