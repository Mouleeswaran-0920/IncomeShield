const express = require('express');
const router = express.Router();
const claimController = require('../controllers/ClaimController');

router.get('/detect-disruption', claimController.checkDisruption);
router.post('/claim', claimController.createClaim);
router.post('/payout', claimController.payout);
router.post('/risk-score', claimController.getRiskScore);
router.post('/predict-income', claimController.predictIncome);
router.post('/fraud-check', claimController.fraudCheck);

module.exports = router;
