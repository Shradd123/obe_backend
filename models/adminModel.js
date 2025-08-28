// const db = require('../config/db');

// exports.getAdminByEmail = (email, callback) => {
//   const query = 'SELECT * FROM admin WHERE email = ?';
//   db.query(query, [email], (err, results) => {
//     console.log('Query:', query, 'Email param:', email);
//     console.log('DB results:', results);
//     callback(err, results);
//   });
// };
// const insertAdmin = (name, email, hashedPassword, callback) => {
//   db.query(
//     'INSERT INTO admin (name, , password,email) VALUES (?, ?, ?)',
//     [name, email, hashedPassword],
//     callback
//   );
// };

// module.exports = {

//   insertAdmin,
// };

const { db } = require('../config/db'); // ✅ Destructure only db
exports.getAdminByEmail = (email, callback) => {
  const query = 'SELECT * FROM admin WHERE email = ?';
  db.query(query, [email], (err, results) => {
    callback(err, results);
  });
};

exports.insertAdmin = (name, email, password, callback) => {
  const query = 'INSERT INTO admin (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, email, password], (err, results) => {
    callback(err, results);
  });
};

