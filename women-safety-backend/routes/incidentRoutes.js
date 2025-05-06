const express = require('express');
const router = express.Router();
const { reportIncident, getIncident } = require('../controllers/incidentController');
const auth = require('../middleware/auth');

router.post('/report', auth, reportIncident);
router.get('/:incidentId', auth, getIncident);

module.exports = router;