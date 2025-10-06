// // // const { dbPool } = require("../config/db");

// // // // GET course info + tso summary
// // // exports.getCourseData = async (req, res) => {
// // //   try {
// // //     const { courseId } = req.params;

// // //     // --- 1. Fetch base course info ---
// // //     const [courseRows] = await dbPool.query(
// // //       `SELECT c.course_id, c.name AS courseName, c.code AS courseCode, c.nba AS nbaCode
// // //        FROM course c
// // //        WHERE c.course_id = ?
// // //        LIMIT 1`,
// // //       [courseId]
// // //     );

// // //     let courseInfo = courseRows[0] || {};

// // //     // --- 2. Fetch extended course info if already saved ---
// // //     const [extraInfoRows] = await dbPool.query(
// // //       `SELECT * FROM tso_course_info WHERE course_id = ?`,
// // //       [courseId]
// // //     );

// // //     if (extraInfoRows.length > 0) {
// // //       courseInfo = { ...courseInfo, ...extraInfoRows[0] };
// // //     }

// // //     // --- 3. Fetch modules + contents + tso details ---
// // //     const [modules] = await dbPool.query(
// // //       `SELECT * FROM tso_modules WHERE course_id = ?`,
// // //       [courseId]
// // //     );

// // //     for (let mod of modules) {
// // //       const [contents] = await dbPool.query(
// // //         `SELECT * FROM tso_course_contents WHERE module_id = ?`,
// // //         [mod.module_id]
// // //       );

// // //       for (let content of contents) {
// // //         const [tsos] = await dbPool.query(
// // //           `SELECT * FROM tso_details WHERE content_id = ?`,
// // //           [content.content_id]
// // //         );
// // //         content.tsoDetails = tsos;
// // //       }

// // //       mod.courseContents = contents;
// // //     }

// // //     res.json({
// // //       courseInfo,
// // //       modules,
// // //     });
// // //   } catch (err) {
// // //     console.error("❌ Error fetching course data:", err);
// // //     res.status(500).json({ error: "Failed to fetch course data" });
// // //   }
// // // };

// // // // SAVE or UPDATE course info (typed manually by user)
// // // exports.saveCourseInfo = async (req, res) => {
// // //   try {
// // //     const {
// // //       course_id,
// // //       classStrength,
// // //       commencementDate,
// // //       lastWorkingDay,
// // //       noOfSessions,
// // //     } = req.body;

// // //     await dbPool.query(
// // //       `INSERT INTO tso_course_info (course_id, classStrength, commencementDate, lastWorkingDay, noOfSessions)
// // //        VALUES (?, ?, ?, ?, ?)
// // //        ON DUPLICATE KEY UPDATE 
// // //          classStrength = VALUES(classStrength),
// // //          commencementDate = VALUES(commencementDate),
// // //          lastWorkingDay = VALUES(lastWorkingDay),
// // //          noOfSessions = VALUES(noOfSessions)`,
// // //       [course_id, classStrength, commencementDate, lastWorkingDay, noOfSessions]
// // //     );

// // //     res.json({ message: "✅ Course info saved successfully" });
// // //   } catch (err) {
// // //     console.error("❌ Error saving course info:", err);
// // //     res.status(500).json({ error: "Failed to save course info" });
// // //   }
// // // };

// // // // ADD module + nested course contents + tso details
// // // exports.addModule = async (req, res) => {
// // //   try {
// // //     const { course_id, moduleName, courseContents } = req.body;

// // //     // Insert module
// // //     const [modRes] = await dbPool.query(
// // //       `INSERT INTO tso_modules (course_id, module_name) VALUES (?, ?)`,
// // //       [course_id, moduleName]
// // //     );

// // //     const moduleId = modRes.insertId;

// // //     // Insert course contents + tso details
// // //     for (let content of courseContents) {
// // //       const [contRes] = await dbPool.query(
// // //         `INSERT INTO tso_course_contents (module_id, course_content) VALUES (?, ?)`,
// // //         [moduleId, content.courseContent]
// // //       );

// // //       const contentId = contRes.insertId;

// // //       for (let tso of content.tsoDetails) {
// // //         await dbPool.query(
// // //           `INSERT INTO tso_details (content_id, tso_code, tso_description, co_cl)
// // //            VALUES (?, ?, ?, ?)`,
// // //           [contentId, tso.tsoCode, tso.tsoDescription, tso.coCl]
// // //         );
// // //       }
// // //     }

// // //     res.json({ message: "✅ Module and details added successfully" });
// // //   } catch (err) {
// // //     console.error("❌ Error adding module:", err);
// // //     res.status(500).json({ error: "Failed to add module" });
// // //   }
// // // };
// // const { dbPool } = require("../config/db");

// // // ------------------- GET course info + tso summary -------------------
// // exports.getCourseData = async (req, res) => {
// //   try {
// //     const { courseId } = req.params;

// //     // 1. Base info (from course)
// //     const [courseRows] = await dbPool.query(
// //       `SELECT c.course_id, c.name AS courseName, c.code AS courseCode, c.nba AS nbaCode
// //        FROM course c
// //        WHERE c.course_id = ?
// //        LIMIT 1`,
// //       [courseId]
// //     );
// //     let courseInfo = courseRows[0] || {};

// //     // 2. Cover page info (faculty incharge, semester, year, etc.)
// //     const [coverRows] = await dbPool.query(
// //       `SELECT semesterSection, academicYear, facultyIncharge, courseCoordinator
// //        FROM course_cover_page
// //        WHERE course_id = ?
// //        LIMIT 1`,
// //       [courseId]
// //     );
// //     if (coverRows.length > 0) {
// //       courseInfo = { ...courseInfo, ...coverRows[0] };
// //     }

// //     // 3. Extra TSO-specific info (manual fields)
// //     const [extraInfoRows] = await dbPool.query(
// //       `SELECT classStrength, commencementDate, lastWorkingDay, noOfSessions
// //        FROM tso_course_info
// //        WHERE course_id = ?
// //        LIMIT 1`,
// //       [courseId]
// //     );
// //     if (extraInfoRows.length > 0) {
// //       courseInfo = { ...courseInfo, ...extraInfoRows[0] };
// //     }

// //     // 4. Modules + contents + TSO details
// //     const [modules] = await dbPool.query(
// //       `SELECT * FROM tso_modules WHERE course_id = ?`,
// //       [courseId]
// //     );

// //     for (let mod of modules) {
// //       const [contents] = await dbPool.query(
// //         `SELECT * FROM tso_course_contents WHERE module_id = ?`,
// //         [mod.module_id]
// //       );

// //       for (let content of contents) {
// //         const [tsos] = await dbPool.query(
// //           `SELECT * FROM tso_details WHERE content_id = ?`,
// //           [content.content_id]
// //         );
// //         content.tsoDetails = tsos;
// //       }

// //       mod.courseContents = contents;
// //     }

// //     res.json({ courseInfo, modules });
// //   } catch (err) {
// //     console.error("❌ Error fetching course data:", err);
// //     res.status(500).json({ error: "Failed to fetch course data" });
// //   }
// // };

// // // ------------------- SAVE or UPDATE course info -------------------
// // exports.saveCourseInfo = async (req, res) => {
// //   try {
// //     const {
// //       course_id,
// //       faculty_id,
// //       classStrength,
// //       commencementDate,
// //       lastWorkingDay,
// //       noOfSessions,
// //     } = req.body;

// //     await dbPool.query(
// //       `INSERT INTO tso_course_info (course_id, faculty_id, classStrength, commencementDate, lastWorkingDay, noOfSessions)
// //        VALUES (?, ?, ?, ?, ?, ?)
// //        ON DUPLICATE KEY UPDATE 
// //          classStrength = VALUES(classStrength),
// //          commencementDate = VALUES(commencementDate),
// //          lastWorkingDay = VALUES(lastWorkingDay),
// //          noOfSessions = VALUES(noOfSessions)`,
// //       [
// //         course_id,
// //         faculty_id,
// //         classStrength,
// //         commencementDate,
// //         lastWorkingDay,
// //         noOfSessions,
// //       ]
// //     );

// //     res.json({ message: "✅ Course info saved successfully" });
// //   } catch (err) {
// //     console.error("❌ Error saving course info:", err);
// //     res.status(500).json({ error: "Failed to save course info" });
// //   }
// // };

// // // ------------------- ADD module + nested details -------------------
// // exports.addModule = async (req, res) => {
// //   try {
// //     const { course_id, moduleName, courseContents } = req.body;

// //     // Insert module
// //     const [modRes] = await dbPool.query(
// //       `INSERT INTO tso_modules (course_id, module_name) VALUES (?, ?)`,
// //       [course_id, moduleName]
// //     );
// //     const moduleId = modRes.insertId;

// //     // Insert contents + TSO details
// //     for (let content of courseContents) {
// //       const [contRes] = await dbPool.query(
// //         `INSERT INTO tso_course_contents (module_id, course_content) VALUES (?, ?)`,
// //         [moduleId, content.courseContent]
// //       );
// //       const contentId = contRes.insertId;

// //       for (let tso of content.tsoDetails) {
// //         await dbPool.query(
// //           `INSERT INTO tso_details (content_id, tso_code, tso_description, co_cl)
// //            VALUES (?, ?, ?, ?)`,
// //           [contentId, tso.tsoCode, tso.tsoDescription, tso.coCl]
// //         );
// //       }
// //     }

// //     res.json({ message: "✅ Module and details added successfully" });
// //   } catch (err) {
// //     console.error("❌ Error adding module:", err);
// //     res.status(500).json({ error: "Failed to add module" });
// //   }
// // };
// const { dbPool } = require("../config/db");

// // ------------------- GET course info + tso summary -------------------
// exports.getCourseData = async (req, res) => {
//   try {
//     const { courseId } = req.params;

//     // 1. Base course info
//     const [courseRows] = await dbPool.query(
//       `SELECT c.course_id, c.name AS courseName, c.code AS courseCode, c.nba AS nbaCode
//        FROM course c
//        WHERE c.course_id = ?
//        LIMIT 1`,
//       [courseId]
//     );
//     let courseInfo = courseRows[0] || {};

//     // 2. Cover page info
//     const [coverRows] = await dbPool.query(
//       `SELECT semesterSection, academicYear, facultyIncharge, courseCoordinator
//        FROM course_cover_page
//        WHERE course_id = ?
//        LIMIT 1`,
//       [courseId]
//     );
//     if (coverRows.length > 0) {
//       courseInfo = { ...courseInfo, ...coverRows[0] };
//     }

//     // 3. Extra tso_course_info fields
//     const [extraInfoRows] = await dbPool.query(
//       `SELECT faculty_id, classStrength, commencementDate, lastWorkingDay, noOfSessions
//        FROM tso_course_info
//        WHERE course_id = ?
//        LIMIT 1`,
//       [courseId]
//     );
//     if (extraInfoRows.length > 0) {
//       courseInfo = { ...courseInfo, ...extraInfoRows[0] };
//     }

//     // 4. Modules + contents + tsoDetails
//     const [modules] = await dbPool.query(
//       `SELECT * FROM tso_modules WHERE course_id = ?`,
//       [courseId]
//     );

//     for (let mod of modules) {
//       const [contents] = await dbPool.query(
//         `SELECT * FROM tso_course_contents WHERE module_id = ?`,
//         [mod.module_id]
//       );

//       for (let content of contents) {
//         const [tsos] = await dbPool.query(
//           `SELECT * FROM tso_details WHERE content_id = ?`,
//           [content.content_id]
//         );
//         content.tsoDetails = tsos;
//       }

//       mod.courseContents = contents;
//     }

//     res.json({ courseInfo, modules });
//   } catch (err) {
//     console.error("❌ Error fetching course data:", err);
//     res.status(500).json({ error: "Failed to fetch course data" });
//   }
// };

// // ------------------- SAVE or UPDATE course info -------------------
// exports.saveCourseInfo = async (req, res) => {
//   try {
//     const {
//       course_id,
//       faculty_id,
//       classStrength,
//       commencementDate,
//       lastWorkingDay,
//       noOfSessions,
//     } = req.body;

//     await dbPool.query(
//       `INSERT INTO tso_course_info (course_id, faculty_id, classStrength, commencementDate, lastWorkingDay, noOfSessions)
//        VALUES (?, ?, ?, ?, ?, ?)
//        ON DUPLICATE KEY UPDATE 
//          faculty_id = VALUES(faculty_id),
//          classStrength = VALUES(classStrength),
//          commencementDate = VALUES(commencementDate),
//          lastWorkingDay = VALUES(lastWorkingDay),
//          noOfSessions = VALUES(noOfSessions)`,
//       [
//         course_id,
//         faculty_id,
//         classStrength,
//         commencementDate,
//         lastWorkingDay,
//         noOfSessions,
//       ]
//     );

//     res.json({ message: "✅ Course info saved successfully" });
//   } catch (err) {
//     console.error("❌ Error saving course info:", err);
//     res.status(500).json({ error: "Failed to save course info" });
//   }
// };

// // ------------------- ADD module + nested details -------------------
// exports.addModule = async (req, res) => {
//   try {
//     const { course_id, moduleName, courseContents } = req.body;

//     // Insert module
//     const [modRes] = await dbPool.query(
//       `INSERT INTO tso_modules (course_id, module_name) VALUES (?, ?)`,
//       [course_id, moduleName]
//     );
//     const moduleId = modRes.insertId;

//     // Insert contents + tsoDetails
//     for (let content of courseContents) {
//       const [contRes] = await dbPool.query(
//         `INSERT INTO tso_course_contents (module_id, course_content) VALUES (?, ?)`,
//         [moduleId, content.courseContent]
//       );
//       const contentId = contRes.insertId;

//       for (let tso of content.tsoDetails) {
//         await dbPool.query(
//           `INSERT INTO tso_details (content_id, tso_code, tso_description, co_cl)
//            VALUES (?, ?, ?, ?)`,
//           [contentId, tso.tsoCode, tso.tsoDescription, tso.coCl]
//         );
//       }
//     }

//     res.json({ message: "✅ Module and details added successfully" });
//   } catch (err) {
//     console.error("❌ Error adding module:", err);
//     res.status(500).json({ error: "Failed to add module" });
//   }
// };
const { dbPool } = require("../config/db");

// ------------------- GET course info + tso summary -------------------
exports.getCourseData = async (req, res) => {
  try {
    const { courseId } = req.params;

    // 1. Base course info
    const [courseRows] = await dbPool.query(
      `SELECT c.course_id, c.name AS courseName, c.code AS courseCode, c.nba AS nbaCode
       FROM course c
       WHERE c.course_id = ?
       LIMIT 1`,
      [courseId]
    );
    let courseInfo = courseRows[0] || {};

    // 2. Cover page info
    const [coverRows] = await dbPool.query(
      `SELECT semesterSection, academicYear, facultyIncharge, courseCoordinator
       FROM course_cover_page
       WHERE course_id = ?
       LIMIT 1`,
      [courseId]
    );
    if (coverRows.length > 0) {
      courseInfo = { ...courseInfo, ...coverRows[0] };
    }

    // 3. Extra tso_course_info fields (now includes instructor, semester, academicYear)
    const [extraInfoRows] = await dbPool.query(
      `SELECT faculty_id, instructor, semester, academicYear, 
              classStrength, commencementDate, lastWorkingDay, noOfSessions
       FROM tso_course_info
       WHERE course_id = ?
       LIMIT 1`,
      [courseId]
    );
    if (extraInfoRows.length > 0) {
      courseInfo = { ...courseInfo, ...extraInfoRows[0] };
    }

    // 4. Modules + contents + tsoDetails
    const [modules] = await dbPool.query(
      `SELECT * FROM tso_modules WHERE course_id = ?`,
      [courseId]
    );

    for (let mod of modules) {
      const [contents] = await dbPool.query(
        `SELECT * FROM tso_course_contents WHERE module_id = ?`,
        [mod.module_id]
      );

      for (let content of contents) {
        const [tsos] = await dbPool.query(
          `SELECT * FROM tso_details WHERE content_id = ?`,
          [content.content_id]
        );
        content.tsoDetails = tsos;
      }

      mod.courseContents = contents;
    }
const { dbPool } = require("../config/db");

// ------------------- GET course info + tso summary -------------------
exports.getCourseData = async (req, res) => {
  try {
    const { offeringId } = req.params;

    // 1. Base course info
    const [courseRows] = await dbPool.query(
      `SELECT c.course_id, c.name AS courseName, c.code AS courseCode, c.nba AS nbaCode
       FROM course c
       JOIN course_offering co ON co.course_id = c.course_id
       WHERE co.offering_id = ?
       LIMIT 1`,
      [offeringId]
    );
    let courseInfo = courseRows[0] || {};

    // 2. Cover page info
    const [coverRows] = await dbPool.query(
      `SELECT semesterSection, academicYear, facultyIncharge, courseCoordinator
       FROM course_cover_page
       WHERE course_id = (SELECT course_id FROM course_offering WHERE offering_id = ?)
       LIMIT 1`,
      [offeringId]
    );
    if (coverRows.length > 0) {
      courseInfo = { ...courseInfo, ...coverRows[0] };
    }

    // 3. Extra tso_course_info fields
    const [extraInfoRows] = await dbPool.query(
      `SELECT faculty_id, instructor, semester, academicYear, 
              classStrength, commencementDate, lastWorkingDay, noOfSessions
       FROM tso_course_info
       WHERE offering_id = ?
       LIMIT 1`,
      [offeringId]
    );
    if (extraInfoRows.length > 0) {
      courseInfo = { ...courseInfo, ...extraInfoRows[0] };
    }

    // 4. Modules + contents + tsoDetails
    const [modules] = await dbPool.query(
      `SELECT * FROM tso_modules WHERE offering_id = ?`,
      [offeringId]
    );

    for (let mod of modules) {
      const [contents] = await dbPool.query(
        `SELECT * FROM tso_course_contents WHERE module_id = ?`,
        [mod.module_id]
      );

      for (let content of contents) {
        const [tsos] = await dbPool.query(
          `SELECT * FROM tso_details WHERE content_id = ?`,
          [content.content_id]
        );
        content.tsoDetails = tsos;
      }

      mod.courseContents = contents;
    }

    res.json({ courseInfo, modules });
  } catch (err) {
    console.error("❌ Error fetching course data:", err);
    res.status(500).json({ error: "Failed to fetch course data" });
  }
};

// ------------------- SAVE or UPDATE course info -------------------
exports.saveCourseInfo = async (req, res) => {
  try {
    const {
      offering_id,
      faculty_id,
      instructor,
      semester,
      academicYear,
      classStrength,
      commencementDate,
      lastWorkingDay,
      noOfSessions,
    } = req.body;

    await dbPool.query(
      `INSERT INTO tso_course_info 
         (offering_id, faculty_id, instructor, semester, academicYear, 
          classStrength, commencementDate, lastWorkingDay, noOfSessions)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         faculty_id = VALUES(faculty_id),
         instructor = VALUES(instructor),
         semester = VALUES(semester),
         academicYear = VALUES(academicYear),
         classStrength = VALUES(classStrength),
         commencementDate = VALUES(commencementDate),
         lastWorkingDay = VALUES(lastWorkingDay),
         noOfSessions = VALUES(noOfSessions)`,
      [
        offering_id,
        faculty_id,
        instructor,
        semester,
        academicYear,
        classStrength,
        commencementDate,
        lastWorkingDay,
        noOfSessions,
      ]
    );

    res.json({ message: "✅ Course info saved successfully" });
  } catch (err) {
    console.error("❌ Error saving course info:", err);
    res.status(500).json({ error: "Failed to save course info" });
  }
};

// ------------------- ADD module + nested details -------------------
exports.addModule = async (req, res) => {
  try {
    const { offering_id, moduleName, courseContents } = req.body;

    // Insert module
    const [modRes] = await dbPool.query(
      `INSERT INTO tso_modules (offering_id, module_name) VALUES (?, ?)`,
      [offering_id, moduleName]
    );
    const moduleId = modRes.insertId;

    // Insert contents + tsoDetails
    for (let content of courseContents) {
      const [contRes] = await dbPool.query(
        `INSERT INTO tso_course_contents (module_id, course_content) VALUES (?, ?)`,
        [moduleId, content.courseContent]
      );
      const contentId = contRes.insertId;

      for (let tso of content.tsoDetails) {
        await dbPool.query(
          `INSERT INTO tso_details (content_id, tso_code, tso_description, co_cl)
           VALUES (?, ?, ?, ?)`,
          [contentId, tso.tsoCode, tso.tsoDescription, tso.coCl]
        );
      }
    }

    res.json({ message: "✅ Module and details added successfully" });
  } catch (err) {
    console.error("❌ Error adding module:", err);
    res.status(500).json({ error: "Failed to add module" });
  }
};

    res.json({ courseInfo, modules });
  } catch (err) {
    console.error("❌ Error fetching course data:", err);
    res.status(500).json({ error: "Failed to fetch course data" });
  }
};

// ------------------- SAVE or UPDATE course info -------------------
exports.saveCourseInfo = async (req, res) => {
  try {
    const {
      course_id,
      faculty_id,
      instructor,
      semester,
      academicYear,
      classStrength,
      commencementDate,
      lastWorkingDay,
      noOfSessions,
    } = req.body;

    await dbPool.query(
      `INSERT INTO tso_course_info 
         (course_id, faculty_id, instructor, semester, academicYear, 
          classStrength, commencementDate, lastWorkingDay, noOfSessions)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         faculty_id = VALUES(faculty_id),
         instructor = VALUES(instructor),
         semester = VALUES(semester),
         academicYear = VALUES(academicYear),
         classStrength = VALUES(classStrength),
         commencementDate = VALUES(commencementDate),
         lastWorkingDay = VALUES(lastWorkingDay),
         noOfSessions = VALUES(noOfSessions)`,
      [
        course_id,
        faculty_id,
        instructor,
        semester,
        academicYear,
        classStrength,
        commencementDate,
        lastWorkingDay,
        noOfSessions,
      ]
    );

    res.json({ message: "✅ Course info saved successfully" });
  } catch (err) {
    console.error("❌ Error saving course info:", err);
    res.status(500).json({ error: "Failed to save course info" });
  }
};

// ------------------- ADD module + nested details -------------------
exports.addModule = async (req, res) => {
  try {
    const { course_id, moduleName, courseContents } = req.body;

    // Insert module
    const [modRes] = await dbPool.query(
      `INSERT INTO tso_modules (course_id, module_name) VALUES (?, ?)`,
      [course_id, moduleName]
    );
    const moduleId = modRes.insertId;

    // Insert contents + tsoDetails
    for (let content of courseContents) {
      const [contRes] = await dbPool.query(
        `INSERT INTO tso_course_contents (module_id, course_content) VALUES (?, ?)`,
        [moduleId, content.courseContent]
      );
      const contentId = contRes.insertId;

      for (let tso of content.tsoDetails) {
        await dbPool.query(
          `INSERT INTO tso_details (content_id, tso_code, tso_description, co_cl)
           VALUES (?, ?, ?, ?)`,
          [contentId, tso.tsoCode, tso.tsoDescription, tso.coCl]
        );
      }
    }

    res.json({ message: "✅ Module and details added successfully" });
  } catch (err) {
    console.error("❌ Error adding module:", err);
    res.status(500).json({ error: "Failed to add module" });
  }
};
