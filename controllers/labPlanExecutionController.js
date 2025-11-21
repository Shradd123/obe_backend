


// const { dbPool } = require("../config/db");

// // ==================================================
// // 🔹 Get lab plan & execution data (always include experiments)
// // Example: GET /api/lab-plan-execution/offering/5?batch=A1
// // ==================================================
// const getLabPlanExecution = async (req, res) => {
//   const { offering_id } = req.params;
//   const { batch } = req.query;

//   try {
//     // Get all experiments for the offering (from syllabus)
//     // and left join plan/execution details for that batch
//     const [rows] = await dbPool.query(
//       `
//       SELECT 
//         ls.id AS syllabus_id,
//         ls.exp_no AS experiment_no,
//         ls.statement AS name,
//         COALESCE(lpe.planning_date, '') AS planningDate,
//         COALESCE(lpe.execution_date, '') AS executionDate,
//         ? AS batch_name
//       FROM lab_syllabus ls
//       LEFT JOIN lab_plan_execution lpe
//         ON ls.offering_id = lpe.offering_id
//        AND ls.exp_no = lpe.exp_no
//        AND lpe.batch_name = ?
//       WHERE ls.offering_id = ?
//       ORDER BY ls.exp_no ASC
//       `,
//       [batch, batch, offering_id]
//     );

//     res.json(rows);
//   } catch (err) {
//     console.error("❌ Error fetching lab plan execution:", err);
//     res.status(500).json({ message: "Error fetching lab plan execution" });
//   }
// };

// // ==================================================
// // 🔹 Get distinct batches for an offering
// // ==================================================
// const getBatchesByOffering = async (req, res) => {
//   const { offering_id } = req.params;

//   try {
//     const [rows] = await dbPool.query(
//       `
//       SELECT DISTINCT batch_name
//       FROM student_list
//       WHERE offering_id = ?
//       ORDER BY batch_name ASC
//       `,
//       [offering_id]
//     );

//     res.json(rows);
//   } catch (err) {
//     console.error("❌ Error fetching batches:", err);
//     res.status(500).json({ message: "Error fetching batches" });
//   }
// };

// // ==================================================
// // 🔹 Save or update lab plan & execution for a batch
// // ==================================================
// const addLabPlanExecution = async (req, res) => {
//   try {
//     const { offering_id, batch_name, experiments } = req.body;

//     if (!offering_id || !batch_name || !Array.isArray(experiments)) {
//       return res.status(400).json({ message: "Invalid data" });
//     }

//     for (const exp of experiments) {
//       if (!exp.experiment_no) continue;

//       // Check if this exp already exists for the batch
//       const [existing] = await dbPool.query(
//         `SELECT id FROM lab_plan_execution 
//          WHERE offering_id = ? AND batch_name = ? AND exp_no = ?`,
//         [offering_id, batch_name, exp.experiment_no]
//       );

//       if (existing.length > 0) {
//         // Update
//         await dbPool.query(
//           `UPDATE lab_plan_execution
//            SET planning_date = ?, execution_date = ?, name = ?
//            WHERE id = ?`,
//           [exp.planningDate || null, exp.executionDate || null, exp.name, existing[0].id]
//         );
//       } else {
//         // Insert new
//         await dbPool.query(
//           `INSERT INTO lab_plan_execution (offering_id, batch_name, exp_no, name, planning_date, execution_date)
//            VALUES (?, ?, ?, ?, ?, ?)`,
//           [
//             offering_id,
//             batch_name,
//             exp.experiment_no,
//             exp.name,
//             exp.planningDate || null,
//             exp.executionDate || null,
//           ]
//         );
//       }
//     }

//     res.json({ message: "✅ Saved successfully" });
//   } catch (err) {
//     console.error("❌ Error saving lab plan execution:", err);
//     res.status(500).json({ message: "Error saving lab plan execution" });
//   }
// };

// // ==================================================
// // 🔹 Update one experiment manually (optional)
// // ==================================================
// const updateLabPlanExecution = async (req, res) => {
//   const { id } = req.params;
//   const { experiment_no, name, planning_date, execution_date } = req.body;

//   try {
//     await dbPool.query(
//       `
//       UPDATE lab_plan_execution
//       SET exp_no = ?, name = ?, planning_date = ?, execution_date = ?
//       WHERE id = ?
//       `,
//       [experiment_no, name, planning_date || null, execution_date || null, id]
//     );

//     res.json({ message: "✅ Experiment updated successfully" });
//   } catch (err) {
//     console.error("❌ Error updating lab plan execution:", err);
//     res.status(500).json({ message: "Error updating lab plan execution" });
//   }
// };

// // ==================================================
// // 🔹 Delete one experiment entry
// // ==================================================
// const deleteLabPlanExecution = async (req, res) => {
//   const { id } = req.params;

//   try {
//     await dbPool.query(`DELETE FROM lab_plan_execution WHERE id = ?`, [id]);
//     res.json({ message: "🗑️ Experiment deleted successfully" });
//   } catch (err) {
//     console.error("❌ Error deleting lab plan execution:", err);
//     res.status(500).json({ message: "Error deleting lab plan execution" });
//   }
// };

// module.exports = {
//   getLabPlanExecution,
//   getBatchesByOffering,
//   addLabPlanExecution,
//   updateLabPlanExecution,
//   deleteLabPlanExecution,
// };


const { dbPool } = require("../config/db");

// ==================================================
// 🔹 Get lab plan & execution data (always include experiments)
// Example: GET /api/lab-plan-execution/offering/5?batch=A1
// ==================================================
const getLabPlanExecution = async (req, res) => {
  const { offering_id } = req.params;
  const { batch } = req.query;

  try {
    const [rows] = await dbPool.query(
      `
      SELECT 
        ls.id AS syllabus_id,
        ls.exp_no AS exp_no,                     
        ls.statement AS name,
        COALESCE(lpe.planning_date, '') AS planningDate,
        COALESCE(lpe.execution_date, '') AS executionDate,
        ? AS batch_name
      FROM lab_syllabus ls
      LEFT JOIN lab_plan_execution lpe
        ON ls.offering_id = lpe.offering_id
       AND ls.exp_no = lpe.exp_no
       AND lpe.batch_name = ?
      WHERE ls.offering_id = ?
      ORDER BY ls.exp_no ASC
      `,
      [batch, batch, offering_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching lab plan execution:", err);
    res.status(500).json({ message: "Error fetching lab plan execution" });
  }
};

// ==================================================
// 🔹 Get distinct batches for an offering
// ==================================================
const getBatchesByOffering = async (req, res) => {
  const { offering_id } = req.params;

  try {
    const [rows] = await dbPool.query(
      `
      SELECT DISTINCT batch_name
      FROM student_list
      WHERE offering_id = ?
      ORDER BY batch_name ASC
      `,
      [offering_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching batches:", err);
    res.status(500).json({ message: "Error fetching batches" });
  }
};

// ==================================================
// 🔹 Save or update lab plan & execution for a batch
// ==================================================
const addLabPlanExecution = async (req, res) => {
  try {
    const { offering_id, batch_name, experiments } = req.body;

    if (!offering_id || !batch_name || !Array.isArray(experiments)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    for (const exp of experiments) {
      if (!exp.exp_no) continue;

      // Check if this experiment exists for the batch
      const [existing] = await dbPool.query(
        `SELECT id, planning_date, execution_date, name
         FROM lab_plan_execution
         WHERE offering_id = ? AND batch_name = ? AND exp_no = ?`,
        [offering_id, batch_name, exp.exp_no]
      );

      if (existing.length > 0) {
        const current = existing[0];

        // Only update if something actually changed
        if (
          current.planning_date !== exp.planningDate ||
          current.execution_date !== exp.executionDate ||
          current.name !== exp.name
        ) {
          await dbPool.query(
            `UPDATE lab_plan_execution
             SET planning_date = ?, execution_date = ?, name = ?
             WHERE id = ?`,
            [exp.planningDate || null, exp.executionDate || null, exp.name, current.id]
          );
        }
      } else {
        // Insert new record for this experiment
        await dbPool.query(
          `INSERT INTO lab_plan_execution 
            (offering_id, batch_name, exp_no, name, planning_date, execution_date)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            offering_id,
            batch_name,
            exp.exp_no,
            exp.name,
            exp.planningDate || null,
            exp.executionDate || null,
          ]
        );
      }
    }

    res.json({ message: "✅ Experiments saved successfully" });
  } catch (err) {
    console.error("❌ Error saving lab plan execution:", err);
    res.status(500).json({ message: "Error saving lab plan execution" });
  }
};

// ==================================================
// 🔹 Update one experiment manually (optional)
// ==================================================
const updateLabPlanExecution = async (req, res) => {
  const { id } = req.params;
  const { exp_no, name, planning_date, execution_date } = req.body;

  try {
    await dbPool.query(
      `
      UPDATE lab_plan_execution
      SET exp_no = ?, name = ?, planning_date = ?, execution_date = ?
      WHERE id = ?
      `,
      [exp_no, name, planning_date || null, execution_date || null, id]
    );

    res.json({ message: "✅ Experiment updated successfully" });
  } catch (err) {
    console.error("❌ Error updating lab plan execution:", err);
    res.status(500).json({ message: "Error updating lab plan execution" });
  }
};

// ==================================================
// 🔹 Delete one experiment entry
// ==================================================
const deleteLabPlanExecution = async (req, res) => {
  const { id } = req.params;

  try {
    await dbPool.query(`DELETE FROM lab_plan_execution WHERE id = ?`, [id]);
    res.json({ message: "🗑️ Experiment deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting lab plan execution:", err);
    res.status(500).json({ message: "Error deleting lab plan execution" });
  }
};

module.exports = {
  getLabPlanExecution,
  getBatchesByOffering,
  addLabPlanExecution,
  updateLabPlanExecution,
  deleteLabPlanExecution,
};
