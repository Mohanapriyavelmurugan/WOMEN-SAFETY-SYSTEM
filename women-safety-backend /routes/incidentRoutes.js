const express = require('express');
const router = express.Router();
const { reportIncident, getUserIncidents } = require('../controllers/incidentController');

router.post('/report', reportIncident);
router.get('/:userId', getUserIncidents);

module.exports = router;
