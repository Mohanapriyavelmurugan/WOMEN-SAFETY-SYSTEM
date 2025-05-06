const db = require('../db');

const getCase = (req, res) => {
  const { caseId } = req.params;
  const sql = 'SELECT * FROM case_tracking WHERE id = ?';
  
  db.query(sql, [caseId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'Case not found' });
    }
    
    res.json(result[0]);
  });
};

const updateCase = (req, res) => {
  const { caseId } = req.params;
  const { status, update } = req.body;
  
  const sql = 'UPDATE case_tracking SET status = ?, last_updated = CURRENT_TIMESTAMP WHERE id = ?';
  
  db.query(sql, [status, caseId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Case not found' });
    }
    
    // Add update to case updates
    const updateSql = 'INSERT INTO case_updates (case_id, message) VALUES (?, ?)';
    db.query(updateSql, [caseId, update], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to add case update' });
      }
      
      res.json({ message: 'Case updated successfully' });
    });
  });
};

module.exports = {
  getCase,
  updateCase
}; 