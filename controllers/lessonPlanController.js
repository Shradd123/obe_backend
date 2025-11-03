// const { dbPool } = require("../config/db");

// // 🧩 Fetch course info
// exports.getCourseDetails = async (req, res) => {
//   try {
//     const { offeringId } = req.params;
//     const [rows] = await dbPool.query(
//       `SELECT c.course_code AS code, c.course_name AS name, c.credits
//        FROM course_offerings o
//        JOIN courses c ON o.course_id = c.id
//        WHERE o.offering_id = ?`,
//       [offeringId]
//     );

//     if (rows.length === 0) return res.status(404).json({ error: "Course not found" });
//     res.json(rows[0]);
//   } catch (err) {
//     console.error("Error fetching course:", err);
//     res.status(500).json({ error: "Failed to fetch course" });
//   }
// };

// // 🧩 Fetch lesson plan
// exports.getLessonPlan = async (req, res) => {
//   try {
//     const { offeringId } = req.params;
//     const [rows] = await dbPool.query(
//       `SELECT id, class_no AS no, module_no AS moduleNo, topic, 
//               DATE_FORMAT(date_of_plan, '%Y-%m-%d') AS dateOfPlan, 
//               DATE_FORMAT(executed_date, '%Y-%m-%d') AS executedDate, 
//               remarks
//        FROM lesson_plan
//        WHERE offering_id = ?
//        ORDER BY class_no ASC`,
//       [offeringId]
//     );
//     res.json(rows);
//   } catch (err) {
//     console.error("Error fetching lesson plan:", err);
//     res.status(500).json({ error: "Failed to fetch lesson plan" });
//   }
// };

// // 🧩 Save lesson plan
// exports.saveLessonPlan = async (req, res) => {
//   try {
//     const { offeringId } = req.params;
//     const plan = req.body; // expect array

//     if (!Array.isArray(plan)) return res.status(400).json({ error: "Invalid payload" });

//     // Delete existing rows
//     await dbPool.query("DELETE FROM lesson_plan WHERE offering_id = ?", [offeringId]);

//     if (plan.length === 0) return res.json({ message: "Lesson plan saved successfully" });

//     const values = plan.map((r) => [
//       offeringId,
//       r.no || null,
//       r.moduleNo || null,
//       r.topic || "",
//       r.dateOfPlan || null,
//       r.executedDate || null,
//       r.remarks || ""
//     ]);

//     await dbPool.query(
//       `INSERT INTO lesson_plan 
//         (offering_id, class_no, module_no, topic, date_of_plan, executed_date, remarks)
//        VALUES ?`,
//       [values]
//     );

//     res.json({ message: "Lesson plan saved successfully" });
//   } catch (err) {
//     console.error("Error saving lesson plan:", err);
//     res.status(500).json({ error: "Failed to save lesson plan" });
//   }
// };

// // 🧩 Fetch theory session
// exports.getTheorySession = async (req, res) => {
//   try {
//     const { offeringId } = req.params;
//     const [rows] = await dbPool.query(
//       `SELECT class_no AS classNo, module, contents, tso, outcomes, co_cl AS coCl
//        FROM theory_session
//        WHERE offering_id = ?
//        ORDER BY class_no ASC`,
//       [offeringId]
//     );
//     res.json(rows);
//   } catch (err) {
//     console.error("Error fetching theory session:", err);
//     res.status(500).json({ error: "Failed to fetch theory session" });
//   }
// };

// // 🧩 Save theory session
// exports.saveTheorySession = async (req, res) => {
//   try {
//     const { offeringId } = req.params;
//     const data = req.body; // expect array

//     if (!Array.isArray(data)) return res.status(400).json({ error: "Invalid payload" });

//     // Delete existing rows
//     await dbPool.query("DELETE FROM theory_session WHERE offering_id = ?", [offeringId]);

//     if (data.length === 0) return res.json({ message: "Theory session saved successfully" });

//     const values = data.map((r) => [
//       offeringId,
//       r.classNo || "",
//       r.module || "",
//       r.contents || "",
//       r.tso || "",
//       r.outcomes || "",
//       r.coCl || ""
//     ]);

//     await dbPool.query(
//       `INSERT INTO theory_session 
//         (offering_id, class_no, module, contents, tso, outcomes, co_cl)
//        VALUES ?`,
//       [values]
//     );

//     res.json({ message: "Theory session saved successfully" });
//   } catch (err) {
//     console.error("Error saving theory session:", err);
//     res.status(500).json({ error: "Failed to save theory session" });
//   }
// };


const { dbPool } = require("../config/db");

// =======================
// SAVE OR UPDATE THEORY TABLE
// =======================
const saveTheorySessionOutcomes = async (req, res) => {
  try {
    const { offering_id } = req.params;
    const { rows } = req.body; // array of table rows

    if (!offering_id) return res.status(400).json({ message: "Offering ID is required" });

    // Delete old entries to replace cleanly
    await dbPool.query("DELETE FROM theory_session_outcomes WHERE offering_id = ?", [offering_id]);

    // Insert new rows
    for (const row of rows) {
      await dbPool.query(
        `INSERT INTO theory_session_outcomes (offering_id, class_no, module, contents, tso, outcomes, co_cl)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          offering_id,
          row.classNo || null,
          row.module || null,
          row.contents || null,
          row.tso || null,
          row.outcomes || null,
          row.coCl || null,
        ]
      );
    }

    return res.json({ message: "Theory Session Outcomes Saved Successfully" });
  } catch (err) {
    console.error("Error saving theory outcomes:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// =======================
// SAVE OR UPDATE LESSON PLAN
// =======================
const saveLessonPlan = async (req, res) => {
  try {
    const { offering_id } = req.params;
    const { lessons } = req.body; // array of lesson rows

    if (!offering_id) return res.status(400).json({ message: "Offering ID is required" });

    // Clear previous records
    await dbPool.query("DELETE FROM lesson_plan WHERE offering_id = ?", [offering_id]);

    // Insert new lesson plan rows
    for (const lesson of lessons) {
      await dbPool.query(
        `INSERT INTO lesson_plan (offering_id, module_no, topic, date_of_plan, executed_date, remarks)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          offering_id,
          lesson.moduleNo || null,
          lesson.topic || null,
          lesson.dateOfPlan || null,
          lesson.executedDate || null,
          lesson.remarks || null,
        ]
      );
    }

    return res.json({ message: "Lesson Plan Saved Successfully" });
  } catch (err) {
    console.error("Error saving lesson plan:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// =======================
// FETCH BOTH TABLES
// =======================
const getLessonPlanData = async (req, res) => {
  try {
    const { offering_id } = req.params;

    const [theoryRows] = await dbPool.query(
      "SELECT * FROM theory_session_outcomes WHERE offering_id = ?",
      [offering_id]
    );

    const [lessonRows] = await dbPool.query(
      "SELECT * FROM lesson_plan WHERE offering_id = ?",
      [offering_id]
    );

    return res.json({
      theory: theoryRows,
      lessonPlan: lessonRows,
    });
  } catch (err) {
    console.error("Error fetching lesson plan data:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  saveTheorySessionOutcomes,
  saveLessonPlan,
  getLessonPlanData
};
