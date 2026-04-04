const axios = require('axios');
const { Claim, Earning, User } = require('../models');
const simulationService = require('../services/SimulationService');

exports.checkDisruption = async (req, res) => {
    const env = await simulationService.getEnvironmentData();
    const disruption = env.rain > 50 || env.aqi > 200 || env.traffic > 80;
    res.json({ disruption, ...env });
};

exports.createClaim = async (req, res) => {
    const { user_id, actual_income } = req.body;
    const earning = await Earning.findOne({ where: { user_id, date: new Date().toISOString().split('T')[0] } });
    if (!earning) return res.status(404).json({ error: 'Earning record not found' });

    const loss = Math.max(0, earning.predicted_income - actual_income);
    let payout = loss * 0.8;
    payout = Math.min(payout, 1000); // Cap at ₹1000

    // Disaster Mode logic
    const activeClaimsCount = await Claim.count({ where: { status: 'PENDING' } });
    const THRESHOLD = 100; // Example threshold
    if (activeClaimsCount > THRESHOLD) {
        const availableFunds = 50000; // Mock budget
        const totalPotentialPayouts = activeClaimsCount * 500; // Mock average
        const scalingFactor = availableFunds / totalPotentialPayouts;
        payout = payout * Math.min(1, scalingFactor);
    }

    const claim = await Claim.create({ user_id, loss, payout, status: 'PENDING' });
    res.status(201).json(claim);
};

exports.payout = async (req, res) => {
    const { claim_id } = req.body;
    const claim = await Claim.findByPk(claim_id);
    if (!claim) return res.status(404).json({ error: 'Claim not found' });

    // Mock Razorpay payout
    claim.status = 'PAID';
    await claim.save();
    res.json({ success: true, transaction_id: 'TXN_' + Math.random().toString(36).substr(2, 9) });
};

const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

exports.getRiskScore = async (req, res) => {
    const response = await axios.post(`${AI_URL}/predict-risk`, req.body);
    res.json(response.data);
};

exports.predictIncome = async (req, res) => {
    const response = await axios.post(`${AI_URL}/predict-income`, req.body);
    res.json(response.data);
};

exports.fraudCheck = async (req, res) => {
    const response = await axios.post(`${AI_URL}/detect-fraud`, req.body);
    res.json(response.data);
};
