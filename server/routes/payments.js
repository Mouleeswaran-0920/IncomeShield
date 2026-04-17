const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/PaymentController');

router.post('/create-order', paymentController.createOrder);
router.post('/verify', paymentController.verifyPayment);
router.post('/process-payout', paymentController.processPayout);

module.exports = router;
