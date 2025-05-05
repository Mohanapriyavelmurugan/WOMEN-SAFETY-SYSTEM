const express = require('express');
const router = express.Router();
const { addPolice, getAllPolice } = require('../controllers/policeController');

router.post('/add', addPolice);
router.get('/all', getAllPolice);

module.exports = router;
