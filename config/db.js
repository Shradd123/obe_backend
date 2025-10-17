// db.js
const mysql = require('mysql2');
const mysql2 = require('mysql2/promise');
const util = require('util');


// CALLBACK-BASED CONNECTION (for old code)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password', // change as needed
  database: 'obe',
});
db.connect((err) => {
  if (err) {
    console.error('MySQL callback connection error:', err);
  } else {
    console.log('Connected to MySQL via callback (dbCallback)');
  }
});

// PROMISE-BASED POOL (for async/await)
const dbPool = mysql2.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password', // change as needed
  database: 'obe',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
db.query = util.promisify(db.query);

module.exports = {
  db, // use this in callback-based code
  dbPool,     // use this in promise-based (async/await) code
};
