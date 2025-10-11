// // controllers/labBeyondSyllabusController.js
// const { dbPool } = require('../config/db');

// // Save Lab Curriculum Gap Analysis Data
// const saveLabCurriculumGapAnalysis = async (req, res) => {
//   try {
//     const { offering_id, actions, gaps, techniques, content } = req.body;

//     if (!offering_id) {
//       return res.status(400).json({ message: "Offering ID is required" });
//     }

//     // ✅ Insert actions
//     if (actions && actions.length > 0) {
//       for (const a of actions) {
//         await dbPool.query(
//           `INSERT INTO lab_curriculum_gap_actions (offering_id, action, co, po, mode, planDate, execDate) 
//            VALUES (?, ?, ?, ?, ?, ?, ?)`,
//           [offering_id, a.proposed, a.co, a.po, a.mode, a.plan || null, a.exec || null]
//         );
//       }
//     }

//     // ✅ Insert syllabus gaps
//     if (gaps && gaps.length > 0) {
//       for (const g of gaps) {
//         await dbPool.query(
//           `INSERT INTO lab_curriculum_syllabus_gaps (offering_id, topic, benchmark, proposed, mode, planDate, execDate) 
//            VALUES (?, ?, ?, ?, ?, ?, ?)`,
//           [offering_id, g.topic, g.org, g.action, g.mode, g.plan || null, g.exec || null]
//         );
//       }
//     }

//     // ✅ Insert innovations
//     if (techniques && techniques.length > 0) {
//       for (const t of techniques) {
//         await dbPool.query(
//           `INSERT INTO lab_curriculum_innovations (offering_id, technique, purpose) 
//            VALUES (?, ?, ?)`,
//           [offering_id, t.technique, t.purpose]
//         );
//       }
//     }

//     // ✅ Insert beyond syllabus content
//     if (content && content.length > 0) {
//       for (const c of content) {
//         await dbPool.query(
//           `INSERT INTO lab_curriculum_beyond_syllabus (offering_id, activity, relevance, mode, planDate, execDate) 
//            VALUES (?, ?, ?, ?, ?, ?)`,
//           [offering_id, c.activity, c.relevance, c.mode, c.plan || null, c.exec || null]
//         );
//       }
//     }

//     res.json({ message: "Lab Curriculum Gap Analysis saved successfully" });
//   } catch (err) {
//     console.error("Error saving Lab Curriculum Gap Analysis:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Fetch existing data by offering_id
// const getLabCurriculumGapAnalysis = async (req, res) => {
//   try {
//     const { offering_id } = req.params;

//     if (!offering_id) {
//       return res.status(400).json({ message: "Offering ID is required" });
//     }

//     const [actions] = await dbPool.query(
//       "SELECT * FROM lab_curriculum_gap_actions WHERE offering_id = ?",
//       [offering_id]
//     );

//     const [gaps] = await dbPool.query(
//       "SELECT * FROM lab_curriculum_syllabus_gaps WHERE offering_id = ?",
//       [offering_id]
//     );

//     const [techniques] = await dbPool.query(
//       "SELECT * FROM lab_curriculum_innovations WHERE offering_id = ?",
//       [offering_id]
//     );

//     const [content] = await dbPool.query(
//       "SELECT * FROM lab_curriculum_beyond_syllabus WHERE offering_id = ?",
//       [offering_id]
//     );

//     res.json({ actions, gaps, techniques, content });
//   } catch (err) {
//     console.error("Error fetching Lab Curriculum Gap Analysis:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = {
//   saveLabCurriculumGapAnalysis,
//   getLabCurriculumGapAnalysis,
// };
const { dbPool } = require("../config/db");

// ✅ Save Lab Curriculum Gap Analysis Data
const saveLabCurriculumGapAnalysis = async (req, res) => {
  try {
    const { offering_id, actions, gaps, techniques, content } = req.body;

    if (!offering_id) {
      return res.status(400).json({ message: "Offering ID is required" });
    }

    // ✅ Insert Actions
    if (Array.isArray(actions) && actions.length > 0) {
      for (const a of actions) {
        await dbPool.query(
          `INSERT INTO lab_curriculum_gap_actions 
           (offering_id, action, co, po, mode, planDate, execDate)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [offering_id, a.proposed, a.co, a.po, a.mode, a.plan || null, a.exec || null]
        );
      }
    }

    // ✅ Insert Syllabus Gaps
    if (Array.isArray(gaps) && gaps.length > 0) {
      for (const g of gaps) {
        await dbPool.query(
          `INSERT INTO lab_curriculum_syllabus_gaps 
           (offering_id, topic, benchmark, proposed, mode, planDate, execDate)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [offering_id, g.topic, g.org, g.action, g.mode, g.plan || null, g.exec || null]
        );
      }
    }

    // ✅ Insert Innovations
    if (Array.isArray(techniques) && techniques.length > 0) {
      for (const t of techniques) {
        await dbPool.query(
          `INSERT INTO lab_curriculum_innovations 
           (offering_id, technique, purpose)
           VALUES (?, ?, ?)`,
          [offering_id, t.technique, t.purpose]
        );
      }
    }

    // ✅ Insert Beyond Syllabus Content
    if (Array.isArray(content) && content.length > 0) {
      for (const c of content) {
        await dbPool.query(
          `INSERT INTO lab_curriculum_beyond_syllabus 
           (offering_id, activity, relevance, mode, planDate, execDate)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [offering_id, c.activity, c.relevance, c.mode, c.plan || null, c.exec || null]
        );
      }
    }

    res.json({ message: "Lab Curriculum Gap Analysis saved successfully ✅" });
  } catch (err) {
    console.error("❌ Error saving Lab Curriculum Gap Analysis:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Fetch existing data by offering_id
const getLabCurriculumGapAnalysis = async (req, res) => {
  try {
    const { offering_id } = req.params;

    if (!offering_id) {
      return res.status(400).json({ message: "Offering ID is required" });
    }

    const [actions] = await dbPool.query(
      "SELECT * FROM lab_curriculum_gap_actions WHERE offering_id = ?",
      [offering_id]
    );
    const [gaps] = await dbPool.query(
      "SELECT * FROM lab_curriculum_syllabus_gaps WHERE offering_id = ?",
      [offering_id]
    );
    const [techniques] = await dbPool.query(
      "SELECT * FROM lab_curriculum_innovations WHERE offering_id = ?",
      [offering_id]
    );
    const [content] = await dbPool.query(
      "SELECT * FROM lab_curriculum_beyond_syllabus WHERE offering_id = ?",
      [offering_id]
    );

    res.json({ actions, gaps, techniques, content });
  } catch (err) {
    console.error("❌ Error fetching Lab Curriculum Gap Analysis:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  saveLabCurriculumGapAnalysis,
  getLabCurriculumGapAnalysis,
};
