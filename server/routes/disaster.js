const express = require('express');
const router = express.Router();
const disasterController = require('../controllers/DisasterController');

router.post('/advanced-trigger', disasterController.triggerDisaster);
router.get('/priority-queue', disasterController.getPriorityQueue);
router.get('/status', disasterController.getStatus);

module.exports = router;
