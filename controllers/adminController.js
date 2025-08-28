const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminModel = require('../models/adminModel');

const SECRET_KEY = '4a7d1ed414474e4033ac29ccb8653d9b5e2c6b43c5d1e9e2e5c3a6e3e8d8f6e2';

// ------------------------
// LOGIN ADMIN
// ------------------------
exports.loginAdmin = (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email, password); // <-- Log 1

  adminModel.getAdminByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    if (results.length === 0) {
      console.log('No admin found with email:', email); // <-- Log 2
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const admin = results[0];
    console.log('Admin from DB:', admin); // <-- Log 3

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log('Password mismatch'); // <-- Log 4
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Success
    const token = jwt.sign(
      { email: admin.email, role: 'admin', name: admin.name },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      email: admin.email,
      name: admin.name,
      admin_id: admin.admin_id, // ✅ include admin_id
    });
  });
};

// ------------------------
// SIGNUP ADMIN
// ------------------------
exports.signupAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password required' });
  }

  adminModel.getAdminByEmail(email, async (err, results) => {
    if (err) {
      console.error('Signup DB error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: 'Admin already exists' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      adminModel.insertAdmin(name, email, hashedPassword, (err) => {
        if (err) {
          console.error('Insert admin error:', err);
          return res.status(500).json({ message: 'Failed to create admin', error: err });
        }

        res.status(201).json({ message: 'Admin registered successfully' });
      });

    } catch (hashErr) {
      console.error('Password hash error:', hashErr);
      return res.status(500).json({ message: 'Server error during password hashing' });
    }
  });
};
