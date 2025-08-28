const { db } = require('../config/db'); // ✅ Destructure only db

const createDepartment = async (name, code, adminId) => {
  const result = await db.query(
    'INSERT INTO dept (name, code, admin_id) VALUES (?, ?, ?)',
    [name, code, adminId]
  );
  return result; // MySQL returns object with insertId, etc.
};


const updateDepartment = (id, name, code, callback) => {
  db.query(
    'UPDATE dept SET name = ?, code = ? WHERE dept_id = ?',
    [name, code, id],
    callback
  );
};

const deleteDepartment = (id, callback) => {
  db.query('DELETE FROM dept WHERE dept_id = ?', [id], callback);
};
module.exports = {
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
