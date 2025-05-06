const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Function to generate unique case ID
const generateCaseId = () => {
  const prefix = 'CASE';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|mp4/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .jpg, .jpeg, .png, .webp and .mp4 formats are supported!'));
  }
}).single('evidence');

const reportIncident = (req, res) => {
  console.log('Report incident called with body:', req.body);
  console.log('User:', req.user);

  upload(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: err.message });
    }

    try {
      const { date, time, location, type, description } = req.body;
      const userId = req.user.id; // Authenticated user
      const evidencePath = req.file ? req.file.path : null;

      console.log('Processing incident report:', {
        date, time, location, type, description,
        userId, evidencePath
      });

      // Validate required fields
      if (!date || !time || !location || !type || !description) {
        return res.status(400).json({ message: 'All fields are required except evidence' });
      }

      const sql = 'INSERT INTO incidents (user_id, date, time, location, type, description, evidence) VALUES (?, ?, ?, ?, ?, ?, ?)';
      db.query(sql, [userId, date, time, location, type, description, evidencePath], (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error' });
        }

        // Generate unique case ID
        const caseId = generateCaseId();
        console.log('Generated case ID:', caseId);
        
        // Create case tracking entry
        const caseSql = 'INSERT INTO case_tracking (case_id, incident_id, status) VALUES (?, ?, "New")';
        db.query(caseSql, [caseId, result.insertId], (err, caseResult) => {
          if (err) {
            console.error('Case tracking error:', err);
            return res.status(500).json({ message: 'Failed to create case tracking' });
          }

          // Log the report action
          const logSql = 'INSERT INTO case_updates (case_id, status, notes) VALUES (?, ?, ?)';
          db.query(logSql, [caseId, 'New', 'Incident reported by user'], (err) => {
            if (err) {
              console.error('Logging error:', err);
              // Continue even if logging fails
            }
            console.log('Incident reported successfully with case ID:', caseId);
            res.status(201).json({
              message: 'Incident reported successfully',
              caseId: caseId
            });
          });
        });
      });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
};

const getIncident = (req, res) => {
  const { incidentId } = req.params;
  const sql = 'SELECT * FROM incidents WHERE id = ?';
  
  db.query(sql, [incidentId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    
    res.json(result[0]);
  });
};

module.exports = {
  reportIncident,
  getIncident
};