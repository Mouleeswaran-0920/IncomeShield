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

router.post('/initiate-payment', async (req, res) => {
    try {
        const { amount, userId } = req.body;
        const payment = await paymentService.initiateRazorpayPayment(amount, userId);
        res.json(payment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
