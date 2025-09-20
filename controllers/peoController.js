// const { dbPool } = require('../config/db');

// // Get PEOs for a course (mapped via department)
// const getPEOs = async (req, res) => {
//   try {
//     const { course_id } = req.params;
//     if (!course_id) {
//       return res.status(400).json({ message: 'Course ID or code is required' });
//     }

//     // Determine if course_id is numeric or a code
//     let courseQuery = '';
//     let queryParam = course_id;

//     if (isNaN(course_id)) {
//       // It's a course code
//       courseQuery = `
//         SELECT pr.dept_id
//         FROM course c
//         JOIN schema_course sc ON sc.course_id = c.course_id
//         JOIN schema_table st ON st.schema_id = sc.schema_id
//         JOIN program pr ON pr.program_id = st.program_id
//         WHERE c.code = ? -- your schema uses "code", not "courseCode"
//         LIMIT 1
//       `;
//     } else {
//       // Numeric course_id
//       courseQuery = `
//         SELECT pr.dept_id
//         FROM course c
//         JOIN schema_course sc ON sc.course_id = c.course_id
//         JOIN schema_table st ON st.schema_id = sc.schema_id
//         JOIN program pr ON pr.program_id = st.program_id
//         WHERE c.course_id = ?
//         LIMIT 1
//       `;
//     }

//     const [courseRows] = await dbPool.query(courseQuery, [queryParam]);

//     if (!courseRows.length) {
//       return res.status(404).json({ message: 'Course not found or not linked to a program' });
//     }

//     const deptId = courseRows[0].dept_id;

//     // Fetch PEOs from the correct table
//     const [peoRows] = await dbPool.query(
//       'SELECT peo_id, title, description FROM peo WHERE dept_id = ? ORDER BY peo_id',
//       [deptId]
//     );

//     const peos = peoRows.length
//       ? peoRows.map(row => ({ id: row.peo_id, title: row.title, description: row.description }))
//       : [];

//     res.json({ peos });
//   } catch (err) {
//     console.error('Error fetching PEOs:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = { getPEOs };
const { dbPool } = require('../config/db');

// Get PEOs for a course (mapped via department)
const getPEOs = async (req, res) => {
  try {
    const { course_id } = req.params;
    if (!course_id) {
      return res.status(400).json({ message: 'Course ID or code is required' });
    }

    // Determine if course_id is numeric or a course code
    const isNumeric = !isNaN(course_id);
    const courseQuery = isNumeric
      ? `
        SELECT pr.dept_id
        FROM course c
        JOIN schema_course sc ON sc.course_id = c.course_id
        JOIN schema_table st ON st.schema_id = sc.schema_id
        JOIN program pr ON pr.program_id = st.program_id
        WHERE c.course_id = ?
        LIMIT 1
      `
      : `
        SELECT pr.dept_id
        FROM course c
        JOIN schema_course sc ON sc.course_id = c.course_id
        JOIN schema_table st ON st.schema_id = sc.schema_id
        JOIN program pr ON pr.program_id = st.program_id
        WHERE c.code = ?
        LIMIT 1
      `;

    const [courseRows] = await dbPool.query(courseQuery, [course_id]);

    if (!courseRows.length) {
      return res.status(404).json({ message: 'Course not found or not linked to a program' });
    }

    const deptId = courseRows[0].dept_id;

    // Fetch PEOs for the department
    const [peoRows] = await dbPool.query(
      'SELECT peo_id, title, description FROM peo WHERE dept_id = ? ORDER BY peo_id',
      [deptId]
    );

    const peos = peoRows.length
      ? peoRows.map((row, index) => ({
          number: index + 1,      // Optional: add numbering (PEO 1, PEO 2…)
          title: row.title,        // Display title instead of id
          description: row.description
        }))
      : [];

    res.json({ peos });
  } catch (err) {
    console.error('Error fetching PEOs:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getPEOs };
