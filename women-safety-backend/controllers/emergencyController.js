const db = require('../db');

const addEmergencyContact = (req, res) => {
  const { user_id, name, phone } = req.body;
  const sql = 'INSERT INTO emergency_contacts (user_id, name, phone) VALUES (?, ?, ?)';
  db.query(sql, [user_id, name, phone], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Emergency contact added' });
  });
};

const getEmergencyContacts = (req, res) => {
  const userId = req.params.userId;
  const sql = 'SELECT * FROM emergency_contacts WHERE user_id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

module.exports = { addEmergencyContact, getEmergencyContacts };
