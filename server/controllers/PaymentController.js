const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YourKeyHere',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'YourSecretHere',
});

exports.createOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt = 'receipt_1' } = req.body;
        
        const options = {
            amount: amount * 100, // amount in the smallest currency unit
            currency,
            receipt,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error('RAZORPAY_ORDER_ERROR:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'YourSecretHere')
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            return res.json({ message: "Payment verified successfully", success: true });
        } else {
            return res.status(400).json({ message: "Invalid signature sent!", success: false });
        }
    } catch (error) {
        console.error('RAZORPAY_VERIFY_ERROR:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.processPayout = async (req, res) => {
    try {
        const { environmentalData, userId } = req.body;
        const { rain, aqi, traffic } = environmentalData;

        // Parametric Thresholds
        const rainThreshold = 20; // 20mm/h
        const aqiThreshold = 250;
        const trafficThreshold = 85;

        const isDisrupted = rain > rainThreshold || aqi > aqiThreshold || traffic > trafficThreshold;

        if (isDisrupted) {
            const amount = 500 + Math.floor(Math.random() * 500); // Random ₹500 - ₹1000
            return res.json({
                payoutTriggered: true,
                payout: {
                    amount,
                    currency: 'INR',
                    description: `Automatic payout for ${rain > rainThreshold ? 'Heavy Rain' : aqi > aqiThreshold ? 'Critical AQI' : 'Gridlock Traffic'}`
                }
            });
        }

        res.json({ payoutTriggered: false });
    } catch (error) {
        res.status(500).json({ error: 'Simulation logic failure' });
    }
};
