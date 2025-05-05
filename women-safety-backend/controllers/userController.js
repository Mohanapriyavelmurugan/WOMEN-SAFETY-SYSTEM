const db = require('../db');

const registerUser = (req, res) => {
  const { name, email, phone, password } = req.body;
  const sql = 'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, phone, password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  });
};

module.exports = { registerUser };
