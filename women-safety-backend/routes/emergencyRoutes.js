const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../db');

// Emergency contact routes
router.post('/contacts', auth, (req, res) => {
  const { name, phone, relation } = req.body;
  const userId = req.user.id;

  const sql = 'INSERT INTO emergency_contacts (user_id, name, phone, relation) VALUES (?, ?, ?, ?)';
  db.query(sql, [userId, name, phone, relation], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error adding emergency contact' });
    }

    res.status(201).json({
      message: 'Emergency contact added successfully',
      contactId: result.insertId
    });
  });
});

router.get('/contacts', auth, (req, res) => {
  const userId = req.user.id;
  const sql = 'SELECT * FROM emergency_contacts WHERE user_id = ?';
  
  db.query(sql, [userId], (err, contacts) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching emergency contacts' });
    }

    res.json(contacts);
  });
});

router.delete('/contacts/:contactId', auth, (req, res) => {
  const { contactId } = req.params;
  const userId = req.user.id;

  const sql = 'DELETE FROM emergency_contacts WHERE id = ? AND user_id = ?';
  db.query(sql, [contactId, userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error deleting emergency contact' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Contact not found or unauthorized' });
    }

    res.json({ message: 'Emergency contact deleted successfully' });
  });
});

module.exports = router;
