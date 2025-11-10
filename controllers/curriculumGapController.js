


// controllers/curriculumGapController.js
// const { dbPool } = require("../config/db");

// // ✅ Convert ISO/JS dates -> MySQL DATE (YYYY-MM-DD)
// const formatDate = (d) => d ? new Date(d).toISOString().slice(0, 10) : null;

// // ===================================================================
// // ✅ SAVE Curriculum Gap Analysis
// // ===================================================================
// exports.saveCurriculumGapAnalysis = async (req, res) => {
//   try {
//     console.log("Request Body:", req.body);

//     let { offeringId, gapActions, syllabusGaps, innovations, beyondSyllabus } = req.body;
//     offeringId = Number(offeringId);

//     if (!offeringId) {
//       return res.status(400).json({ error: "Offering ID is required" });
//     }

//     // Ensure arrays (avoid undefined errors)
//     gapActions = Array.isArray(gapActions) ? gapActions : [];
//     syllabusGaps = Array.isArray(syllabusGaps) ? syllabusGaps : [];
//     innovations = Array.isArray(innovations) ? innovations : [];
//     beyondSyllabus = Array.isArray(beyondSyllabus) ? beyondSyllabus : [];

//     // ✅ Delete old records before insert
//     await dbPool.query("DELETE FROM curriculum_gap_actions WHERE offering_id=?", [offeringId]);
//     await dbPool.query("DELETE FROM curriculum_syllabus_gaps WHERE offering_id=?", [offeringId]);
//     await dbPool.query("DELETE FROM curriculum_innovations WHERE offering_id=?", [offeringId]);
//     await dbPool.query("DELETE FROM curriculum_beyond_syllabus WHERE offering_id=?", [offeringId]);

//     // ✅ Insert Gap Actions
//     for (const row of gapActions) {
//       await dbPool.query(
//         `INSERT INTO curriculum_gap_actions (offering_id, action, co, po, mode, planDate, execDate)
//          VALUES (?, ?, ?, ?, ?, ?, ?)`,
//         [
//           offeringId,
//           row.action,
//           row.co,
//           row.po,
//           row.mode,
//           formatDate(row.planDate),
//           formatDate(row.execDate)
//         ]
//       );
//     }

//     // ✅ Insert Syllabus Gaps
//     for (const row of syllabusGaps) {
//       await dbPool.query(
//         `INSERT INTO curriculum_syllabus_gaps (offering_id, topic, benchmark, proposed, mode, planDate, execDate)
//          VALUES (?, ?, ?, ?, ?, ?, ?)`,
//         [
//           offeringId,
//           row.topic,
//           row.benchmark,
//           row.proposed,
//           row.mode,
//           formatDate(row.planDate),
//           formatDate(row.execDate)
//         ]
//       );
//     }

//     // ✅ Insert Innovations
//     for (const row of innovations) {
//       await dbPool.query(
//         `INSERT INTO curriculum_innovations (offering_id, technique, purpose)
//          VALUES (?, ?, ?)`,
//         [offeringId, row.technique, row.purpose]
//       );
//     }

//     // ✅ Insert Beyond Syllabus Activities
//     for (const row of beyondSyllabus) {
//       await dbPool.query(
//         `INSERT INTO curriculum_beyond_syllabus (offering_id, activity, relevance, mode, planDate, execDate)
//          VALUES (?, ?, ?, ?, ?, ?)`,
//         [
//           offeringId,
//           row.activity,
//           row.relevance,
//           row.mode,
//           formatDate(row.planDate),
//           formatDate(row.execDate)
//         ]
//       );
//     }

//     return res.json({ message: "✅ Curriculum Gap Analysis saved successfully" });

//   } catch (err) {
//     console.error("❌ Error saving curriculum gap:", err);
//     return res.status(500).json({ error: "Server error occurred" });
//   }
// };

// // ===================================================================
// // ✅ FETCH Curriculum Gap Analysis
// // ===================================================================
// exports.getCurriculumGapAnalysis = async (req, res) => {
//   try {
//     const offeringId = Number(req.params.offeringId);

//     if (!offeringId) {
//       return res.status(400).json({ error: "Offering ID is required" });
//     }

//     const [gapActions] = await dbPool.query(
//       "SELECT * FROM curriculum_gap_actions WHERE offering_id=?", [offeringId]
//     );

//     const [syllabusGaps] = await dbPool.query(
//       "SELECT * FROM curriculum_syllabus_gaps WHERE offering_id=?", [offeringId]
//     );

//     const [innovations] = await dbPool.query(
//       "SELECT * FROM curriculum_innovations WHERE offering_id=?", [offeringId]
//     );

//     const [beyondSyllabus] = await dbPool.query(
//       "SELECT * FROM curriculum_beyond_syllabus WHERE offering_id=?", [offeringId]
//     );

//     return res.json({
//       offeringId,
//       gapActions,
//       syllabusGaps,
//       innovations,
//       beyondSyllabus
//     });

//   } catch (err) {
//     console.error("❌ Error fetching curriculum gap:", err);
//     return res.status(500).json({ error: "Server error occurred" });
//   }
// };









// const { dbPool } = require("../config/db");

// // ✅ Convert ISO/JS dates -> MySQL DATE (YYYY-MM-DD) without day shift
// const formatDate = (d) => {
//   if (!d) return null;

//   if (typeof d === "string" && d.length >= 10) {
//     return d.slice(0, 10);
//   }

//   const date = new Date(d);
//   date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
//   return date.toISOString().slice(0, 10);
// };

// // ===================================================================
// // ✅ SAVE Curriculum Gap Analysis
// // ===================================================================
// exports.saveCurriculumGapAnalysis = async (req, res) => {
//   try {
//     console.log("Request Body:", req.body);

//     let { offeringId, gapActions, syllabusGaps, innovations, beyondSyllabus } = req.body;
//     offeringId = Number(offeringId);

//     if (!offeringId) {
//       return res.status(400).json({ error: "Offering ID is required" });
//     }

//     // Ensure arrays
//     gapActions = Array.isArray(gapActions) ? gapActions : [];
//     syllabusGaps = Array.isArray(syllabusGaps) ? syllabusGaps : [];
//     innovations = Array.isArray(innovations) ? innovations : [];
//     beyondSyllabus = Array.isArray(beyondSyllabus) ? beyondSyllabus : [];

//     // ✅ Delete old records before saving
//     await dbPool.query("DELETE FROM curriculum_gap_actions WHERE offering_id=?", [offeringId]);
//     await dbPool.query("DELETE FROM curriculum_syllabus_gaps WHERE offering_id=?", [offeringId]);
//     await dbPool.query("DELETE FROM curriculum_innovations WHERE offering_id=?", [offeringId]);
//     await dbPool.query("DELETE FROM curriculum_beyond_syllabus WHERE offering_id=?", [offeringId]);

//     // ✅ Insert Gap Actions
//     for (const row of gapActions) {
//       await dbPool.query(
//         `INSERT INTO curriculum_gap_actions (offering_id, action, co, po, mode, planDate, execDate)
//          VALUES (?, ?, ?, ?, ?, ?, ?)`,
//         [
//           offeringId,
//           row.action,
//           row.co,
//           row.po,
//           row.mode,
//           formatDate(row.planDate),
//           formatDate(row.execDate)
//         ]
//       );
//     }

//     // ✅ Insert Syllabus Gaps
//     for (const row of syllabusGaps) {
//       await dbPool.query(
//         `INSERT INTO curriculum_syllabus_gaps (offering_id, topic, benchmark, proposed, mode, planDate, execDate)
//          VALUES (?, ?, ?, ?, ?, ?, ?)`,
//         [
//           offeringId,
//           row.topic,
//           row.benchmark,
//           row.proposed,
//           row.mode,
//           formatDate(row.planDate),
//           formatDate(row.execDate)
//         ]
//       );
//     }

//     // ✅ Insert Innovations
//     for (const row of innovations) {
//       await dbPool.query(
//         `INSERT INTO curriculum_innovations (offering_id, technique, purpose)
//          VALUES (?, ?, ?)`,
//         [offeringId, row.technique, row.purpose]
//       );
//     }

//     // ✅ Insert Beyond Syllabus
//     for (const row of beyondSyllabus) {
//       await dbPool.query(
//         `INSERT INTO curriculum_beyond_syllabus (offering_id, activity, relevance, mode, planDate, execDate)
//          VALUES (?, ?, ?, ?, ?, ?)`,
//         [
//           offeringId,
//           row.activity,
//           row.relevance,
//           row.mode,
//           formatDate(row.planDate),
//           formatDate(row.execDate)
//         ]
//       );
//     }

//     return res.json({ message: "✅ Curriculum Gap Analysis saved successfully" });

//   } catch (err) {
//     console.error("❌ Error saving curriculum gap:", err);
//     return res.status(500).json({ error: "Server error occurred" });
//   }
// };

// // ===================================================================
// // ✅ FETCH Curriculum Gap Analysis
// // ===================================================================
// exports.getCurriculumGapAnalysis = async (req, res) => {
//   try {
//     const offeringId = Number(req.params.offeringId);

//     if (!offeringId) {
//       return res.status(400).json({ error: "Offering ID is required" });
//     }

//     const [gapActions] = await dbPool.query(
//       "SELECT * FROM curriculum_gap_actions WHERE offering_id=?", [offeringId]
//     );

//     const [syllabusGaps] = await dbPool.query(
//       "SELECT * FROM curriculum_syllabus_gaps WHERE offering_id=?", [offeringId]
//     );

//     const [innovations] = await dbPool.query(
//       "SELECT * FROM curriculum_innovations WHERE offering_id=?", [offeringId]
//     );

//     const [beyondSyllabus] = await dbPool.query(
//       "SELECT * FROM curriculum_beyond_syllabus WHERE offering_id=?", [offeringId]
//     );

//     return res.json({
//       offeringId,
//       gapActions,
//       syllabusGaps,
//       innovations,
//       beyondSyllabus
//     });

//   } catch (err) {
//     console.error("❌ Error fetching curriculum gap:", err);
//     return res.status(500).json({ error: "Server error occurred" });
//   }
// };









const { dbPool } = require("../config/db");

// ✅ Convert date to YYYY-MM-DD without timezone shift
const formatDate = (d) => {
  if (!d) return null;

  // If already string "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm:ss..."
  if (typeof d === "string") return d.slice(0, 10);

  // If Date object → format manually (no UTC conversion)
  const date = new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// ===================================================================
// ✅ SAVE Curriculum Gap Analysis
// ===================================================================
exports.saveCurriculumGapAnalysis = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    let { offeringId, gapActions, syllabusGaps, innovations, beyondSyllabus } = req.body;
    offeringId = Number(offeringId);

    if (!offeringId) {
      return res.status(400).json({ error: "Offering ID is required" });
    }

    // Ensure arrays
    gapActions = Array.isArray(gapActions) ? gapActions : [];
    syllabusGaps = Array.isArray(syllabusGaps) ? syllabusGaps : [];
    innovations = Array.isArray(innovations) ? innovations : [];
    beyondSyllabus = Array.isArray(beyondSyllabus) ? beyondSyllabus : [];

    // ✅ Delete previous records
    await dbPool.query("DELETE FROM curriculum_gap_actions WHERE offering_id=?", [offeringId]);
    await dbPool.query("DELETE FROM curriculum_syllabus_gaps WHERE offering_id=?", [offeringId]);
    await dbPool.query("DELETE FROM curriculum_innovations WHERE offering_id=?", [offeringId]);
    await dbPool.query("DELETE FROM curriculum_beyond_syllabus WHERE offering_id=?", [offeringId]);

    // ✅ Insert Gap Actions
    for (const row of gapActions) {
      await dbPool.query(
        `INSERT INTO curriculum_gap_actions (offering_id, action, co, po, mode, planDate, execDate)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          offeringId,
          row.action,
          row.co,
          row.po,
          row.mode,
          formatDate(row.planDate),
          formatDate(row.execDate)
        ]
      );
    }

    // ✅ Insert Syllabus Gaps
    for (const row of syllabusGaps) {
      await dbPool.query(
        `INSERT INTO curriculum_syllabus_gaps (offering_id, topic, benchmark, proposed, mode, planDate, execDate)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          offeringId,
          row.topic,
          row.benchmark,
          row.proposed,
          row.mode,
          formatDate(row.planDate),
          formatDate(row.execDate)
        ]
      );
    }

    // ✅ Insert Innovations
    for (const row of innovations) {
      await dbPool.query(
        `INSERT INTO curriculum_innovations (offering_id, technique, purpose)
         VALUES (?, ?, ?)`,
        [offeringId, row.technique, row.purpose]
      );
    }

    // ✅ Insert Beyond Syllabus Activities
    for (const row of beyondSyllabus) {
      await dbPool.query(
        `INSERT INTO curriculum_beyond_syllabus (offering_id, activity, relevance, mode, planDate, execDate)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          offeringId,
          row.activity,
          row.relevance,
          row.mode,
          formatDate(row.planDate),
          formatDate(row.execDate)
        ]
      );
    }

    return res.json({ message: "✅ Curriculum Gap Analysis saved successfully" });

  } catch (err) {
    console.error("❌ Error saving curriculum gap:", err);
    return res.status(500).json({ error: "Server error occurred" });
  }
};

// ===================================================================
// ✅ FETCH Curriculum Gap Analysis
// ===================================================================
exports.getCurriculumGapAnalysis = async (req, res) => {
  try {
    const offeringId = Number(req.params.offeringId);

    if (!offeringId) {
      return res.status(400).json({ error: "Offering ID is required" });
    }

    const [gapActions] = await dbPool.query(
      "SELECT * FROM curriculum_gap_actions WHERE offering_id=?", [offeringId]
    );

    const [syllabusGaps] = await dbPool.query(
      "SELECT * FROM curriculum_syllabus_gaps WHERE offering_id=?", [offeringId]
    );

    const [innovations] = await dbPool.query(
      "SELECT * FROM curriculum_innovations WHERE offering_id=?", [offeringId]
    );

    const [beyondSyllabus] = await dbPool.query(
      "SELECT * FROM curriculum_beyond_syllabus WHERE offering_id=?", [offeringId]
    );

    return res.json({
      offeringId,
      gapActions,
      syllabusGaps,
      innovations,
      beyondSyllabus
    });

  } catch (err) {
    console.error("❌ Error fetching curriculum gap:", err);
    return res.status(500).json({ error: "Server error occurred" });
  }
};
