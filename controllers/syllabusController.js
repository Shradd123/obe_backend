





// const { dbPool } = require("../config/db");

// // ✅ Save or update syllabus
// const saveSyllabus = async (req, res) => {
//   try {
//     const { offering_id } = req.params;
//     const {
//       credits,
//       contactHours,
//       pedagogyHours,
//       prerequisite,
//       objectives,
//       modules
//     } = req.body;

//     if (!offering_id) {
//       return res.status(400).json({ message: "Offering ID is required" });
//     }

//     // ✅ Check if syllabus exists
//     const [existing] = await dbPool.query(
//       "SELECT syllabus_id FROM syllabus WHERE offering_id = ?",
//       [offering_id]
//     );

//     if (existing.length > 0) {
//       // ✅ Update existing record
//       await dbPool.query(
//         `
//         UPDATE syllabus
//         SET credits=?, contact_hours=?, pedagogy_hours=?, prerequisite=?,
//             objectives=?, modules=?
//         WHERE offering_id=?
//         `,
//         [
//           credits,
//           contactHours,
//           pedagogyHours,
//           prerequisite,
//           JSON.stringify(objectives || []),
//           JSON.stringify(modules || []),
//           offering_id
//         ]
//       );
//     } else {
//       // ✅ Insert new record
//       await dbPool.query(
//         `
//         INSERT INTO syllabus
//         (offering_id, credits, contact_hours, pedagogy_hours, prerequisite, objectives, modules)
//         VALUES (?, ?, ?, ?, ?, ?, ?)
//         `,
//         [
//           offering_id,
//           credits,
//           contactHours,
//           pedagogyHours,
//           prerequisite,
//           JSON.stringify(objectives || []),
//           JSON.stringify(modules || [])
//         ]
//       );
//     }

//     return res.json({ message: "Syllabus saved successfully" });
//   } catch (err) {
//     console.error("Error saving syllabus:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };


// // ✅ Fetch syllabus
// const getSyllabus = async (req, res) => {
//   try {
//     const { offering_id } = req.params;

//     const [rows] = await dbPool.query(
//       "SELECT * FROM syllabus WHERE offering_id = ?",
//       [offering_id]
//     );

//     if (rows.length === 0) {
//       return res.json({ syllabus: null });
//     }

//     const d = rows[0];

//     return res.json({
//       syllabus: {
//         credits: d.credits,
//         contactHours: d.contact_hours,
//         pedagogyHours: d.pedagogy_hours,
//         prerequisite: d.prerequisite,
//         objectives: d.objectives ? JSON.parse(d.objectives) : [],
//         modules: d.modules ? JSON.parse(d.modules) : []
//       }
//     });

//   } catch (err) {
//     console.error("Error fetching syllabus:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = { saveSyllabus, getSyllabus };




const { dbPool } = require("../config/db");

// ✅ Save or update syllabus
const saveSyllabus = async (req, res) => {
  try {
    const { offering_id } = req.params;
    const {
      credits,
      contactHours,
      pedagogyHours,
      prerequisite,
      objectives,
      modules
    } = req.body;

    if (!offering_id) {
      return res.status(400).json({ message: "Offering ID is required" });
    }

    // ✅ Check if syllabus exists
    const [existing] = await dbPool.query(
      "SELECT syllabus_id FROM syllabus WHERE offering_id = ?",
      [offering_id]
    );

    const objectivesJSON = JSON.stringify(objectives || []);
    const modulesJSON = JSON.stringify(modules || []);

    if (existing.length > 0) {
      // ✅ Update existing record
      await dbPool.query(
        `
        UPDATE syllabus
        SET credits=?, contact_hours=?, pedagogy_hours=?, prerequisite=?,
            objectives=?, modules=?
        WHERE offering_id=?
        `,
        [
          credits,
          contactHours,
          pedagogyHours,
          prerequisite,
          objectivesJSON,
          modulesJSON,
          offering_id
        ]
      );
    } else {
      // ✅ Insert new record
      await dbPool.query(
        `
        INSERT INTO syllabus
        (offering_id, credits, contact_hours, pedagogy_hours, prerequisite, objectives, modules)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          offering_id,
          credits,
          contactHours,
          pedagogyHours,
          prerequisite,
          objectivesJSON,
          modulesJSON
        ]
      );
    }

    return res.json({ message: "Syllabus saved successfully" });

  } catch (err) {
    console.error("Error saving syllabus:", err);
    return res.status(500).json({ message: "Server error" });
  }
};



// ✅ Safe JSON parser
function safeParseJSON(value) {
  try {
    if (!value) return [];
    if (typeof value !== "string") return value;

    // ✅ Only parse if it is JSON format
    value = value.trim();
    if (value.startsWith("{") || value.startsWith("[")) {
      return JSON.parse(value);
    }

    // ✅ If not JSON, return as string or empty array
    return [];
  } catch {
    return [];
  }
}



// ✅ Fetch syllabus
const getSyllabus = async (req, res) => {
  try {
    const { offering_id } = req.params;

    const [rows] = await dbPool.query(
      "SELECT * FROM syllabus WHERE offering_id = ?",
      [offering_id]
    );

    if (rows.length === 0) {
      return res.json({ syllabus: null });
    }

    const d = rows[0];

    return res.json({
      syllabus: {
        credits: d.credits,
        contactHours: d.contact_hours,
        pedagogyHours: d.pedagogy_hours,
        prerequisite: d.prerequisite,
        objectives: safeParseJSON(d.objectives),
        modules: safeParseJSON(d.modules)
      }
    });

  } catch (err) {
    console.error("Error fetching syllabus:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { saveSyllabus, getSyllabus };
