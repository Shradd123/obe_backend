const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateJWT = require('../middleware/authMiddleware');

router.post('/login', adminController.loginAdmin);
router.post('/signup', adminController.signupAdmin);
router.get('/dashboard', authenticateJWT, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}`, role: req.user.role });
});

module.exports = router;
