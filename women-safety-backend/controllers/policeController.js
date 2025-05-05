const db = require('../db');

const addPolice = (req, res) => {
  const { name, badge_number, contact } = req.body;
  const sql = 'INSERT INTO police (name, badge_number, contact) VALUES (?, ?, ?)';
  db.query(sql, [name, badge_number, contact], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Police officer added' });
  });
};

const getAllPolice = (req, res) => {
  const sql = 'SELECT * FROM police';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

module.exports = { addPolice, getAllPolice };

