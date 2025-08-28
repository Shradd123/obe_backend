const { dbPool } = require('../config/db');

exports.insertFaculty = async ({ faculty_id, name, email, password, dept_id, role }) => {
  const sql = `
    INSERT INTO FACULTY (faculty_id, name, email, password, dept_id, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  await dbPool.execute(sql, [faculty_id, name, email, password, dept_id, role]);
};

exports.getAllFaculty = async () => {
  const [rows] = await dbPool.query('SELECT faculty_id, name, email, dept_id, role FROM FACULTY');
  return rows;
};

exports.getFacultyById = async (id) => {
  const [rows] = await dbPool.query('SELECT faculty_id, name, email, dept_id, role FROM FACULTY WHERE faculty_id = ?', [id]);
  return rows[0];
};

exports.deleteFaculty = async (id) => {
  await dbPool.execute('DELETE FROM FACULTY WHERE faculty_id = ?', [id]);
};
