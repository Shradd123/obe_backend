// controllers/curriculumGapController.js
const { dbPool } = require('../config/db');

// Save Curriculum Gap Analysis data
exports.saveCurriculumGapAnalysis = async (req, res) => {
  const { course_id, gapActions, syllabusGaps, innovations, beyondSyllabus } = req.body;

  if (!course_id) {
    return res.status(400).json({ error: "course_id is required" });
  }

  const conn = await dbPool.getConnection();
  try {
    await conn.beginTransaction();

    // Delete old records for that course_id (if re-submitting)
    await conn.query("DELETE FROM curriculum_gap_actions WHERE course_id = ?", [course_id]);
    await conn.query("DELETE FROM curriculum_syllabus_gaps WHERE course_id = ?", [course_id]);
    await conn.query("DELETE FROM curriculum_innovations WHERE course_id = ?", [course_id]);
    await conn.query("DELETE FROM curriculum_beyond_syllabus WHERE course_id = ?", [course_id]);

    // Insert gapActions
    if (gapActions && gapActions.length > 0) {
      for (const g of gapActions) {
        await conn.query(
          `INSERT INTO curriculum_gap_actions 
            (course_id, action, co, po, mode, planDate, execDate)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [course_id, g.action, g.co, g.po, g.mode, g.planDate || null, g.execDate || null]
        );
      }
    }

    // Insert syllabusGaps
    if (syllabusGaps && syllabusGaps.length > 0) {
      for (const s of syllabusGaps) {
        await conn.query(
          `INSERT INTO curriculum_syllabus_gaps 
            (course_id, topic, benchmark, proposed, mode, planDate, execDate)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [course_id, s.topic, s.benchmark, s.proposed, s.mode, s.planDate || null, s.execDate || null]
        );
      }
    }

    // Insert innovations
    if (innovations && innovations.length > 0) {
      for (const i of innovations) {
        await conn.query(
          `INSERT INTO curriculum_innovations (course_id, technique, purpose) 
           VALUES (?, ?, ?)`,
          [course_id, i.technique, i.purpose]
        );
      }
    }

    // Insert beyondSyllabus
    if (beyondSyllabus && beyondSyllabus.length > 0) {
      for (const b of beyondSyllabus) {
        await conn.query(
          `INSERT INTO curriculum_beyond_syllabus 
            (course_id, activity, relevance, mode, planDate, execDate)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [course_id, b.activity, b.relevance, b.mode, b.planDate || null, b.execDate || null]
        );
      }
    }

    await conn.commit();
    res.json({ message: "Curriculum Gap Analysis saved successfully" });

  } catch (err) {
    await conn.rollback();
    console.error("Error saving Curriculum Gap Analysis:", err);
    res.status(500).json({ error: "Failed to save Curriculum Gap Analysis" });
  } finally {
    conn.release();
  }
};

// Fetch Curriculum Gap Analysis for a course
exports.getCurriculumGapAnalysis = async (req, res) => {
  const { course_id } = req.params;
  try {
    const [gapActions] = await dbPool.query("SELECT * FROM curriculum_gap_actions WHERE course_id = ?", [course_id]);
    const [syllabusGaps] = await dbPool.query("SELECT * FROM curriculum_syllabus_gaps WHERE course_id = ?", [course_id]);
    const [innovations] = await dbPool.query("SELECT * FROM curriculum_innovations WHERE course_id = ?", [course_id]);
    const [beyondSyllabus] = await dbPool.query("SELECT * FROM curriculum_beyond_syllabus WHERE course_id = ?", [course_id]);

    res.json({ course_id, gapActions, syllabusGaps, innovations, beyondSyllabus });
  } catch (err) {
    console.error("Error fetching Curriculum Gap Analysis:", err);
    res.status(500).json({ error: "Failed to fetch Curriculum Gap Analysis" });
  }
};

