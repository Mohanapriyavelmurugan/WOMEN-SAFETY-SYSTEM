const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../db');

// Get case details
router.get('/:caseId', auth, (req, res) => {
  const { caseId } = req.params;
  const sql = `
    SELECT c.*, i.*, u.name as reporter_name, u.phone as reporter_phone
    FROM case_tracking c
    JOIN incidents i ON c.incident_id = i.id
    JOIN users u ON i.user_id = u.id
    WHERE c.case_id = ?
  `;
  
  db.query(sql, [caseId], (err, cases) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching case details' });
    }

    if (cases.length === 0) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.json(cases[0]);
  });
});

// Update case status
router.put('/:caseId/status', auth, (req, res) => {
  const { caseId } = req.params;
  const { status, notes } = req.body;

  // Update case status
  const updateSql = 'UPDATE case_tracking SET status = ? WHERE case_id = ?';
  db.query(updateSql, [status, caseId], (err, updateResult) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error updating case status' });
    }

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: 'Case not found' });
    }

    // Add case update log
    const logSql = 'INSERT INTO case_updates (case_id, status, notes) VALUES (?, ?, ?)';
    db.query(logSql, [caseId, status, notes], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error logging case update' });
      }

      res.json({ message: 'Case status updated successfully' });
    });
  });
});

// Get case updates
router.get('/:caseId/updates', auth, (req, res) => {
  const { caseId } = req.params;
  const sql = 'SELECT * FROM case_updates WHERE case_id = ? ORDER BY created_at DESC';
  
  db.query(sql, [caseId], (err, updates) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching case updates' });
    }

    res.json(updates);
  });
});

module.exports = router;
