const express = require('express');
const router = express.Router();
const { addPolice, getAllPolice } = require('../controllers/policeController');
const auth = require('../middleware/auth');
const db = require('../db');

router.post('/add', addPolice);
router.get('/all', getAllPolice);

// Get nearby police stations
router.get('/nearby', auth, (req, res) => {
  const { latitude, longitude } = req.query;
  
  // Using a simple distance calculation for demo
  // In production, use proper geospatial queries
  const sql = `
    SELECT *, 
    (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance 
    FROM police_stations 
    HAVING distance < 5 
    ORDER BY distance 
    LIMIT 5
  `;
  
  db.query(sql, [latitude, longitude, latitude], (err, stations) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching nearby police stations' });
    }

    res.json(stations);
  });
});

// Get police station details
router.get('/:stationId', auth, (req, res) => {
  const { stationId } = req.params;
  const sql = 'SELECT * FROM police_stations WHERE id = ?';
  
  db.query(sql, [stationId], (err, stations) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching police station details' });
    }

    if (stations.length === 0) {
      return res.status(404).json({ message: 'Police station not found' });
    }

    res.json(stations[0]);
  });
});

module.exports = router;
