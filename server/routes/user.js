const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.get('/income-protection-score', userController.getIncomeProtectionScore);

module.exports = router;
