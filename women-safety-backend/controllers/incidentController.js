const db = require('../db');

const reportIncident = (req, res) => {
  const { user_id, description, location } = req.body;
  const sql = 'INSERT INTO incidents (user_id, description, location) VALUES (?, ?, ?)';
  db.query(sql, [user_id, description, location], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Incident reported successfully' });
  });
};

const getUserIncidents = (req, res) => {
  const userId = req.params.userId;
  const sql = 'SELECT * FROM incidents WHERE user_id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

module.exports = { reportIncident, getUserIncidents };
