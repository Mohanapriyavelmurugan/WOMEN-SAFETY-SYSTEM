const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const auth = require('../middleware/auth');
const db = require('../db');

router.post('/register', register);
router.post('/login', login);

// Get user profile
router.get('/profile', auth, (req, res) => {
  const userId = req.user.id;
  const sql = 'SELECT id, name, email, phone, created_at FROM users WHERE id = ?';
  
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(results[0]);
  });
});

module.exports = router;
