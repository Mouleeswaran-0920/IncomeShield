const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');

router.get('/overview', adminController.getOverview);
router.get('/claims', adminController.getClaims);
router.get('/risk-heatmap', adminController.getRiskHeatmap);

module.exports = router;
