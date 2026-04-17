const axios = require('axios');
const logger = require('../utils/logger');

const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

exports.explainRisk = async (req, res) => {
    try {
        const { rain, aqi, traffic, strike } = req.body;
        const response = await axios.post(`${AI_URL}/risk-score`, { rain, aqi, traffic, strike });
        res.json(response.data);
    } catch (err) {
        logger.error(`ExplainRisk Error: ${err.message}`);
        res.status(500).json({ error: 'AI Service communication failed' });
    }
};

exports.getFraudScore = async (req, res) => {
    try {
        const { deliveries, avg_deliveries } = req.body;
        const response = await axios.post(`${AI_URL}/fraud-score`, { deliveries, avg_deliveries });
        res.json(response.data);
    } catch (err) {
        logger.error(`FraudScore Error: ${err.message}`);
        res.status(500).json({ error: 'AI Service communication failed' });
    }
};
