const db = require('../db');

const assignCase = (req, res) => {
  const { incident_id, police_id, status } = req.body;
  const sql = 'INSERT INTO case_tracking (incident_id, police_id, status) VALUES (?, ?, ?)';
  db.query(sql, [incident_id, police_id, status], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Case assigned' });
  });
};

const updateCaseStatus = (req, res) => {
  const caseId = req.params.caseId;
  const { status } = req.body;
  const sql = 'UPDATE case_tracking SET status = ? WHERE id = ?';
  db.query(sql, [status, caseId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Case status updated' });
  });
};

const getCasesByPolice = (req, res) => {
  const policeId = req.params.policeId;
  const sql = `
    SELECT ct.*, i.description, i.location 
    FROM case_tracking ct 
    JOIN incidents i ON ct.incident_id = i.id 
    WHERE ct.police_id = ?`;
  db.query(sql, [policeId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

module.exports = { assignCase, updateCaseStatus, getCasesByPolice };
