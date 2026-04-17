const express = require('express');
const router = express.Router();
const paymentService = require('../services/PaymentService');

router.get('/weekly-stats/:userId', async (req, res) => {
    try {
        const stats = await paymentService.calculateWeeklyPayout(req.params.userId);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/process-payout', async (req, res) => {
    try {
        const { userId, environmentalData } = req.body;
        const result = await paymentService.processParametricPayout(userId, environmentalData);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
