const { Claim, Earning } = require('../models');
const { Op } = require('sequelize');

class PaymentService {
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
            status: 'INITIATED'
        };
    }
}

module.exports = new PaymentService();
