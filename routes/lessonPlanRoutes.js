// const express = require("express");
// const router = express.Router();
// const lessonPlanController = require("../controllers/lessonPlanController");

// // --------------------- COURSE ---------------------
// // Get course details by offeringId
// router.get("/course/:offeringId", lessonPlanController.getCourseDetails);

// // --------------------- LESSON PLAN ---------------------
// // Get lesson plan by offeringId
// router.get("/lesson-plan/:offeringId", lessonPlanController.getLessonPlan);

// // Save lesson plan by offeringId
// router.post("/lesson-plan/:offeringId", lessonPlanController.saveLessonPlan);

// // --------------------- THEORY SESSION ---------------------
// // Get theory session by offeringId
// router.get("/theory-session/:offeringId", lessonPlanController.getTheorySession);

// // Save theory session by offeringId
// router.post("/theory-session/:offeringId", lessonPlanController.saveTheorySession);

// module.exports = router;


const express = require("express");
const router = express.Router();
const {
  saveTheorySessionOutcomes,
  saveLessonPlan,
  getLessonPlanData
} = require("../controllers/lessonPlancontroller");

// GET existing data
router.get("/:offering_id", getLessonPlanData);

// SAVE theory table
router.post("/:offering_id/theory", saveTheorySessionOutcomes);

// SAVE lesson plan
router.post("/:offering_id/plan", saveLessonPlan);

module.exports = router;
