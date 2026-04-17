const express = require('express');
const router = express.Router();
const aiController = require('../controllers/AIController');

router.post('/explain-risk', aiController.explainRisk);
router.post('/fraud-score', aiController.getFraudScore);

module.exports = router;
