// const { dbPool } = require('../config/db');

// // Get courses for a given batch + semester
// const getCoursesByBatchSem = async (req, res) => {
//   const { batchId, semId } = req.params;

//   try {
//     // 1. Verify batch exists
//     const [batchRows] = await dbPool.query(
//       "SELECT batch_id FROM batch WHERE batch_id = ?",
//       [batchId]
//     );

//     if (batchRows.length === 0) {
//       return res.status(404).json({ error: "Batch not found" });
//     }

//     // 2. Get courses for this batch + semester with course type
//     const [courses] = await dbPool.query(
//       `SELECT 
//           co.offering_id,         
//           c.code, 
//           c.name,
//           a.role,
//           ct.name AS courseType
//        FROM course_offering co
//        JOIN course_teaching_assignment a 
//     ON co.offering_id = a.offering_id
//        JOIN course c 
//             ON co.course_id = c.course_id
//        LEFT JOIN course_type ct 
//             ON c.course_type_id = ct.course_type_id
//        WHERE co.batch_id = ?   
//          AND co.sem_id = ?;
// `,
//       [batchId, semId]   // ✅ fixed
//     );

//     res.json(courses);
//   } catch (err) {
//     console.error("Error fetching courses by batch/sem:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };


// // Get courses for a given batch + semester
// const getCoursesByBatchSems = async (req, res) => {
//   const { batchId, semId } = req.params;

//   try {
//     // 1. Verify batch exists & get schema_id
//     const [batchRows] = await dbPool.query(
//       "SELECT schema_id FROM batch WHERE batch_id = ?",
//       [batchId]
//     );

//     if (batchRows.length === 0) {
//       return res.status(404).json({ error: "Batch not found" });
//     }

//     const schemaId = batchRows[0].schema_id;
//     if (!schemaId) {
//       return res.json([]); // if schema not assigned, return empty
//     }

//     // 2. Get courses for this schema + semester with course type
//     const [courses] = await dbPool.query(
//       `SELECT 
//           c.course_id, 
//           c.code, 
//           c.name, 
//           ct.name AS courseType
//        FROM schema_course sc
//        JOIN course c ON sc.course_id = c.course_id
//        LEFT JOIN course_type ct ON c.course_type_id = ct.course_type_id
//        WHERE sc.schema_id = ? AND sc.sem = ?`,
//       [schemaId, semId]
//     );

//     res.json(courses);
//   } catch (err) {
//     console.error("Error fetching courses by batch/sem:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // module.exports = { getCoursesByBatchSems };

// // module.exports = { getCoursesByBatchSem };
// module.exports = { getCoursesByBatchSems, getCoursesByBatchSem };
// -------------------------------------------------------------------------------------


// const { dbPool } = require('../config/db');

// /**
//  * 🔹 Get assigned courses for a given batch + semester (filtered by faculty if provided)
//  * e.g. GET /api/batch/:batchId/sem/:semId/courses?facultyId=7
//  */
// const getCoursesByBatchSem = async (req, res) => {
//   const { batchId, semId } = req.params;

//   // Validate batchId & semId
//   if (!batchId || isNaN(Number(batchId))) {
//     return res.status(400).json({ error: "Valid batchId is required" });
//   }
//   if (!semId || isNaN(Number(semId))) {
//     return res.status(400).json({ error: "Valid semId is required" });
//   }

//   // Support both ?facultyId= and ?faculty_id=
//   const facultyId = req.query.facultyId
//     ? Number(req.query.facultyId)
//     : req.query.faculty_id
//     ? Number(req.query.faculty_id)
//     : null;

//   if (facultyId !== null && (isNaN(facultyId) || facultyId <= 0)) {
//     return res.status(400).json({ error: "Valid facultyId is required" });
//   }

//   try {
//     // 1️⃣ Verify batch exists
//     const [batchRows] = await dbPool.query(
//       "SELECT batch_id FROM batch WHERE batch_id = ?",
//       [batchId]
//     );
//     if (batchRows.length === 0) {
//       return res.status(404).json({ error: "Batch not found" });
//     }

//     // 2️⃣ Fetch assigned courses (filtered by faculty if provided)
//     let sql = `
//       SELECT DISTINCT
//         co.offering_id,
//         c.course_id,
//         c.code AS course_code,
//         c.name AS course_name,
//         a.role,
//         a.faculty_id,
//         ct.name AS courseType
//       FROM course_offering co
//       JOIN course c ON co.course_id = c.course_id
//       LEFT JOIN course_type ct ON c.course_type_id = ct.course_type_id
//       JOIN course_teaching_assignment a ON co.offering_id = a.offering_id
//       WHERE co.batch_id = ? AND co.sem_id = ?
//     `;

//     const params = [batchId, semId];

//     if (facultyId) {
//       sql += " AND a.faculty_id = ?";
//       params.push(facultyId);
//     }

//     const [courses] = await dbPool.query(sql, params);

//     // 3️⃣ Normalize roles and courseType
//     let normalized = courses.map((row) => ({
//       offering_id: row.offering_id,
//       course_id: row.course_id,
//       course_code: row.course_code,
//       course_name: row.course_name,
//       faculty_id: row.faculty_id,
//       role:
//         row.role?.toLowerCase() === 'coordinator'
//           ? 'Coordinator'
//           : row.role?.toLowerCase() === 'instructor'
//           ? 'Instructor'
//           : 'Associate',
//       courseType:
//         row.courseType ||
//         (row.course_code?.toLowerCase().includes('lab') ? 'Lab' : 'Theory'),
//     }));

//     // 4️⃣ Remove duplicates where faculty is both coordinator & instructor/associate
//     const filteredSubjects = [];
//     const seenOfferingIds = new Set();
//     normalized.forEach((sub) => {
//       const key = sub.offering_id;
//       if (!seenOfferingIds.has(key)) {
//         seenOfferingIds.add(key);
//         filteredSubjects.push(sub);
//       } else if (sub.role.toLowerCase() === 'coordinator') {
//         // Replace previous entry with coordinator
//         const index = filteredSubjects.findIndex((s) => s.offering_id === key);
//         if (index >= 0) filteredSubjects[index] = sub;
//       }
//     });

//     res.json(filteredSubjects);
//   } catch (err) {
//     console.error("Error fetching assigned courses by batch/sem:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// /**
//  * 🔹 Get all courses in the batch’s schema for a semester
//  * e.g. GET /api/batch/:batchId/sem/:semId/sems
//  */
// const getCoursesByBatchSems = async (req, res) => {
//   const { batchId, semId } = req.params;

//   // Validate batchId & semId
//   if (!batchId || isNaN(Number(batchId))) {
//     return res.status(400).json({ error: "Valid batchId is required" });
//   }
//   if (!semId || isNaN(Number(semId))) {
//     return res.status(400).json({ error: "Valid semId is required" });
//   }

//   try {
//     // 1️⃣ Verify batch exists & get schema_id
//     const [batchRows] = await dbPool.query(
//       "SELECT schema_id FROM batch WHERE batch_id = ?",
//       [batchId]
//     );
//     if (batchRows.length === 0) {
//       return res.status(404).json({ error: "Batch not found" });
//     }

//     const schemaId = batchRows[0].schema_id;
//     if (!schemaId) return res.json([]); // no schema, return empty

//     // 2️⃣ Fetch courses from schema_course
//     const [courses] = await dbPool.query(
//       `SELECT 
//           c.course_id, 
//           c.code AS course_code, 
//           c.name AS course_name, 
//           ct.name AS courseType
//        FROM schema_course sc
//        JOIN course c ON sc.course_id = c.course_id
//        LEFT JOIN course_type ct ON c.course_type_id = ct.course_type_id
//        WHERE sc.schema_id = ? AND sc.sem = ?`,
//       [schemaId, semId]
//     );

//     const normalized = courses.map((row) => ({
//       course_id: row.course_id,
//       course_code: row.course_code,
//       course_name: row.course_name,
//       courseType:
//         row.courseType ||
//         (row.course_code?.toLowerCase().includes('lab') ? 'Lab' : 'Theory'),
//     }));

//     res.json(normalized);
//   } catch (err) {
//     console.error("Error fetching schema courses by batch/sem:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// module.exports = { getCoursesByBatchSems, getCoursesByBatchSem };





const { dbPool } = require('../config/db');

/**
 * 🔹 Get assigned courses for a given batch + semester (filtered by faculty if provided)
 * e.g. GET /api/batch/:batchId/sem/:semId/courses?facultyId=7
 */
const getCoursesByBatchSem = async (req, res) => {
  const { batchId, semId } = req.params;

  // ✅ Validate batchId & semId
  if (!batchId || isNaN(Number(batchId))) {
    return res.status(400).json({ error: "Valid batchId is required" });
  }
  if (!semId || isNaN(Number(semId))) {
    return res.status(400).json({ error: "Valid semId is required" });
  }

  // ✅ Support both ?facultyId= and ?faculty_id=
  const facultyId = req.query.facultyId
    ? Number(req.query.facultyId)
    : req.query.faculty_id
    ? Number(req.query.faculty_id)
    : null;

  if (facultyId !== null && (isNaN(facultyId) || facultyId <= 0)) {
    return res.status(400).json({ error: "Valid facultyId is required" });
  }

  try {
    // 1️⃣ Verify batch exists
    const [batchRows] = await dbPool.query(
      "SELECT batch_id FROM batch WHERE batch_id = ?",
      [batchId]
    );
    if (batchRows.length === 0) {
      return res.status(404).json({ error: "Batch not found" });
    }

    // 2️⃣ Fetch assigned courses (filtered by faculty if provided)
    let sql = `
      SELECT 
        co.offering_id,
        c.course_id,
        c.code AS course_code,
        c.name AS course_name,
        a.role,
        a.faculty_id,
        ct.name AS courseType,
        s.name AS section_name
      FROM course_offering co
      JOIN course c ON co.course_id = c.course_id
      LEFT JOIN course_type ct ON c.course_type_id = ct.course_type_id
      JOIN course_teaching_assignment a ON co.offering_id = a.offering_id
      LEFT JOIN section s ON s.section_id = a.section_id
      WHERE co.batch_id = ? AND co.sem_id = ?
    `;

    const params = [batchId, semId];
    if (facultyId) {
      sql += " AND a.faculty_id = ?";
      params.push(facultyId);
    }

    const [courses] = await dbPool.query(sql, params);

    // 3️⃣ Normalize data
    const normalized = courses.map((row) => ({
      offering_id: row.offering_id,
      course_id: row.course_id,
      course_code: row.course_code,
      course_name: row.course_name,
      faculty_id: row.faculty_id,
      section_name: row.section_name || 'N/A',
      role:
        row.role?.toLowerCase() === 'coordinator'
          ? 'Coordinator'
          : row.role?.toLowerCase() === 'instructor'
          ? 'Instructor'
          : 'Associate',
      courseType:
        row.courseType ||
        (row.course_code?.toLowerCase().includes('lab') ? 'Lab' : 'Theory'),
    }));

    /**
     * 4️⃣ Combine duplicates smartly:
     * - If same offering_id but different sections → keep both (faculty handles multiple sections)
     * - If same offering_id + same section but different roles → keep Coordinator as primary
     */
    const finalSubjects = [];
    const seenKeys = new Map(); // key = offering_id + section_name

    normalized.forEach((sub) => {
      const key = `${sub.offering_id}_${sub.section_name}`;
      const existing = seenKeys.get(key);

      if (!existing) {
        seenKeys.set(key, sub);
        finalSubjects.push(sub);
      } else if (sub.role === 'Coordinator' && existing.role !== 'Coordinator') {
        // Replace Instructor/Associate with Coordinator for same section
        const index = finalSubjects.findIndex(
          (s) => s.offering_id === sub.offering_id && s.section_name === sub.section_name
        );
        if (index >= 0) finalSubjects[index] = sub;
      }
    });

    res.json(finalSubjects);
  } catch (err) {
    console.error("❌ Error fetching assigned courses by batch/sem:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * 🔹 Get all courses in the batch’s schema for a semester
 * e.g. GET /api/batch/:batchId/sem/:semId/sems
 */
const getCoursesByBatchSems = async (req, res) => {
  const { batchId, semId } = req.params;

  // ✅ Validate batchId & semId
  if (!batchId || isNaN(Number(batchId))) {
    return res.status(400).json({ error: "Valid batchId is required" });
  }
  if (!semId || isNaN(Number(semId))) {
    return res.status(400).json({ error: "Valid semId is required" });
  }

  try {
    // 1️⃣ Verify batch exists & get schema_id
    const [batchRows] = await dbPool.query(
      "SELECT schema_id FROM batch WHERE batch_id = ?",
      [batchId]
    );
    if (batchRows.length === 0) {
      return res.status(404).json({ error: "Batch not found" });
    }

    const schemaId = batchRows[0].schema_id;
    if (!schemaId) return res.json([]); // no schema, return empty

    // 2️⃣ Fetch courses from schema_course
    const [courses] = await dbPool.query(
      `SELECT 
          c.course_id, 
          c.code AS course_code, 
          c.name AS course_name, 
          ct.name AS courseType
       FROM schema_course sc
       JOIN course c ON sc.course_id = c.course_id
       LEFT JOIN course_type ct ON c.course_type_id = ct.course_type_id
       WHERE sc.schema_id = ? AND sc.sem = ?`,
      [schemaId, semId]
    );

    const normalized = courses.map((row) => ({
      course_id: row.course_id,
      course_code: row.course_code,
      course_name: row.course_name,
      courseType:
        row.courseType ||
        (row.course_code?.toLowerCase().includes('lab') ? 'Lab' : 'Theory'),
    }));

    res.json(normalized);
  } catch (err) {
    console.error("❌ Error fetching schema courses by batch/sem:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getCoursesByBatchSems, getCoursesByBatchSem };

