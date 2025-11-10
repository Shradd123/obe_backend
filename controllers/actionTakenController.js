const { dbPool } = require("../config/db");

// GET Action Taken
exports.getActionTaken = async (req, res) => {
  try {
    const { offering_id } = req.params;

    const [rows] = await dbPool.query(
      `SELECT planned_cie, planned_assignments, planned_feedback,
              cie1, cie2, cie3, assignments, feedbackDate
       FROM action_taken
       WHERE offering_id = ?
       LIMIT 1`,
      [offering_id]
    );

    // Return empty defaults if no record
    res.json(rows[0] || {
      planned_cie: "",
      planned_assignments: "",
      planned_feedback: "",
      cie1: "",
      cie2: "",
      cie3: "",
      assignments: "",
      feedbackDate: ""
    });

  } catch (err) {
    console.error("❌ Error fetching Action Taken:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// SAVE Action Taken
exports.saveActionTaken = async (req, res) => {
  try {
    const {
      offering_id,
      planned_cie,
      planned_assignments,
      planned_feedback,
      cie1,
      cie2,
      cie3,
      assignments,
      feedbackDate
    } = req.body;

    // Check if record exists
    const [exists] = await dbPool.query(
      `SELECT id FROM action_taken WHERE offering_id = ? LIMIT 1`,
      [offering_id]
    );

    if (exists.length > 0) {
      // UPDATE
      await dbPool.query(
        `UPDATE action_taken SET 
          planned_cie=?, planned_assignments=?, planned_feedback=?,
          cie1=?, cie2=?, cie3=?, assignments=?, feedbackDate=?
        WHERE offering_id=?`,
        [
          planned_cie, planned_assignments, planned_feedback,
          cie1, cie2, cie3, assignments, feedbackDate,
          offering_id
        ]
      );
    } else {
      // INSERT
      await dbPool.query(
        `INSERT INTO action_taken 
         (offering_id, planned_cie, planned_assignments, planned_feedback, 
          cie1, cie2, cie3, assignments, feedbackDate)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          offering_id, planned_cie, planned_assignments, planned_feedback,
          cie1, cie2, cie3, assignments, feedbackDate
        ]
      );
    }

    res.json({ message: "Saved successfully" });

  } catch (err) {
    console.error("❌ Error saving Action Taken:", err);
    res.status(500).json({ message: "Server error" });
  }
};
