const express = require('express');
const router = express.Router();
const { assignCase, updateCaseStatus, getCasesByPolice } = require('../controllers/caseController');

router.post('/assign', assignCase);
router.put('/update/:caseId', updateCaseStatus);
router.get('/police/:policeId', getCasesByPolice);

module.exports = router;
