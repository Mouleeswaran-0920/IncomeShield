const express = require('express');
const router = express.Router();
const dataController = require('../controllers/DataController');

router.get('/weather', dataController.getWeather);
router.get('/aqi', dataController.getAQI);

module.exports = router;
