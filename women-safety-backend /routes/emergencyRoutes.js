const express = require('express');
const router = express.Router();
const { addEmergencyContact, getEmergencyContacts } = require('../controllers/emergencyController');

router.post('/add', addEmergencyContact);
router.get('/:userId', getEmergencyContacts);

module.exports = router;
