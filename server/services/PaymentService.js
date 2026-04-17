const { Claim, Earning, Payout } = require('../models');
const { Op } = require('sequelize');

class PaymentService {
    async processParametricPayout(userId, environmentalData) {
        const { rain, aqi, traffic, strike = 0 } = environmentalData;

        // Step 5 Logic
        const expectedIncome = 2500; // Average daily for demo
        
        // Impact weights
        const rainImpact = rain * 5;
        const aqiImpact = aqi > 200 ? (aqi - 200) * 2 : 0;
        const trafficImpact = traffic * 2;
        const strikeImpact = strike * 10;

        const totalDisruptionImpact = rainImpact + aqiImpact + trafficImpact + strikeImpact;
        const actualIncome = Math.max(0, expectedIncome - totalDisruptionImpact);
        const loss = expectedIncome - actualIncome;

        const threshold = 500;
        const isDisrupted = totalDisruptionImpact > threshold;

        let payoutResult = null;

        if (isDisrupted && loss > 300) {
            // Calculate payout (e.g., 80% of loss)
            const payoutAmount = parseFloat((loss * 0.8).toFixed(2));
            
            // Persist to database
            payoutResult = await Payout.create({
                user_id: userId,
                amount: payoutAmount,
                reason: `Environmental disruption (Rain: ${rain}, AQI: ${aqi})`,
                loss_amount: loss,
                disruption_type: this.getDisruptionType(rain, aqi, strike),
                status: 'PROCESSED'
            });
        }

        return {
            expectedIncome,
            actualIncome,
            loss,
            isDisrupted,
            payoutTriggered: !!payoutResult,
            payout: payoutResult
        };
    }

    getDisruptionType(rain, aqi, strike) {
        if (strike > 50) return 'GIG_STRIKE';
        if (rain > 40) return 'SEVERE_RAIN';
        if (aqi > 250) return 'AIR_EMERGENCY';
        return 'GENERAL_ENVIRONMENTAL';
    }

    async calculateWeeklyPayout(userId) {
        // Mocking the past 7 days logic
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - 7);

        const earnings = await Earning.findAll({
            where: {
                user_id: userId,
                date: {
                    [Op.gte]: startOfWeek.toISOString().split('T')[0]
                }
            }
        });

        const totalLoss = earnings.reduce((sum, e) => sum + Math.max(0, e.predicted_income - (e.actual_income || 0)), 0);
        const payout = totalLoss * 0.8;

        return {
            userId,
            totalLoss,
            weeklyPayout: Math.min(payout, 7000), // Cap at 7k per week
            calculationDate: new Date()
        };
    }

    async initiateRazorpayPayment(amount, userId) {
        // Simulated Razorpay integration
        const orderId = 'ORDER_' + Math.random().toString(36).substr(2, 9);
        return {
            success: true,
            orderId,
            amount,
            currency: 'INR',
            status: 'INITIATED',
            timestamp: new Date()
        };
    }

    async processProgressivePayout(claimId) {
        const claim = await Claim.findByPk(claimId);
        if (!claim) throw new Error('Claim not found');

        // 50% Instant Payout
        const instantAmount = claim.payout * 0.5;
        const remainder = claim.payout - instantAmount;

        const transaction = {
            id: 'TXN_' + Math.random().toString(36).substr(2, 12),
            claimId,
            amount: instantAmount,
            status: 'SUCCESS',
            progressive: true,
            type: 'INSTANT_50'
        };

        claim.status = 'PARTIALLY_PAID';
        await claim.save();

        return {
            success: true,
            transaction,
            remainder
        };
    }
}

module.exports = new PaymentService();
