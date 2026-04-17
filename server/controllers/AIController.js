const axios = require('axios');
const logger = require('../utils/logger');

const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

exports.explainRisk = async (req, res) => {
    try {
        const { rain = 0, aqi = 1, traffic = 50 } = req.body;
        
        let insight = "Environmental conditions are currently stable.";
        let recommendation = "Safe for partner operations.";
        let severity = "LOW";

        if (rain > 10 || aqi > 3 || traffic > 80) {
            severity = "MODERATE";
            insight = "Minor disruption patterns detected in current zone.";
            recommendation = "Maintain standard safety protocols.";
        }

        if (rain > 30 || aqi >= 5 || traffic > 90) {
            severity = "HIGH";
            insight = "Significant environmental hazards detected. Income stability at risk.";
            recommendation = "Consider temporary pause in operations to trigger parametric protection.";
        }

        res.json({
            explanation: insight,
            recommendation: recommendation,
            severity: severity,
            timestamp: new Date(),
            factors: {
                rain: Math.min(rain / 50, 1),
                aqi: aqi / 5,
                traffic: traffic / 100
            },
            breakdown: {
                precipitation_impact: rain > 20 ? "HIGH" : "NORMAL",
                air_quality_impact: aqi > 3 ? "STRESSFUL" : "HEALTHY",
                logistics_friction: traffic > 70 ? "SLUGGISH" : "OPTIMAL"
            }
        });
    } catch (err) {
        logger.error(`ExplainRisk Error: ${err.message}`);
        res.status(500).json({ error: 'Risk explanation failed' });
    }
};

exports.getRiskScore = async (req, res) => {
    try {
        const { rain = 0, aqi = 1, traffic = 50 } = req.body;

        // Normalize inputs
        // rain: 0-50mm -> 0-1
        const normRain = Math.min(rain / 50, 1);
        // aqi: 1-5 -> 1:0.2, 5:1.0
        const normAqi = aqi / 5;
        // traffic: 0-100 -> 0-1
        const normTraffic = traffic / 100;

        const score = (normRain * 0.5) + (normAqi * 0.3) + (normTraffic * 0.2);

        res.json({
            riskScore: parseFloat(score.toFixed(2)),
            factors: { rain: normRain, aqi: normAqi, traffic: normTraffic },
            timestamp: new Date()
        });
    } catch (err) {
        logger.error(`RiskScore Error: ${err.message}`);
        res.status(500).json({ error: 'Risk calculation failed' });
    }
};

exports.getFraudScore = async (req, res) => {
    try {
        const { deliveries = 0, avg_deliveries = 0 } = req.body;
        
        // Local heuristic fallback for fraud detection
        const ratio = deliveries / (avg_deliveries || 1);
        const fraudProb = ratio > 1.5 ? 0.8 : ratio > 1.2 ? 0.3 : 0.05;

        res.json({
            fraudProb: fraudProb,
            anomalies: ratio > 1.5 ? ["EXCESSIVE_DELIVERY_VOLUME"] : [],
            status: fraudProb > 0.5 ? "SUSPICIOUS" : "NORMAL",
            timestamp: new Date()
        });
    } catch (err) {
        logger.error(`FraudScore Error: ${err.message}`);
        res.status(500).json({ error: 'Fraud analysis failed' });
    }
};
