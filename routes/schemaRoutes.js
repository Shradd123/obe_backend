const express = require("express");
const router = express.Router();
const schemaController = require("../controllers/schemaController");

// Schema Table CRUD
router.post("/", schemaController.createSchema);   // create schema
router.get("/program/:programId", schemaController.getSchemasByProgram); // get schemas under program

// Schema Courses
router.post("/course/bulk", schemaController.addCoursesToSchema); 
router.get("/:schemaId/courses", schemaController.getSchemaCourses);

const { dbPool } = require('../config/db');

router.get('/', async (req, res) => {
 try {
     const [rows] = await dbPool.query("SELECT * FROM schema_table");
     res.json(rows);
   } catch (err) {
     console.error(err);
     res.status(500).json({ error: "Database error" });
   }
});


// DELETE a course from a schema
router.delete("/:schemaId/course/:courseId", schemaController.deleteCourseFromSchema);


module.exports = router;
