const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
require('dotenv').config();

exports.signup = async (req, res) => {
    try {
        const { name, phone, zone, avg_daily_income, password, role, company, bank_account, ifsc_code } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, phone, zone, avg_daily_income, password: hashedPassword, role, company, bank_account, ifsc_code });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ token, user: { id: user.id, name: user.name, phone: user.phone, zone: user.zone, role: user.role, company: user.company, bank_account: user.bank_account } });
    } catch (error) {
        console.error('AUTH_ERROR:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Phone number already registered. Please Login.' });
        }
        res.status(400).json({ error: error.message || "Signup failed" });
    }
};

exports.login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const user = await User.findOne({ where: { phone } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, name: user.name, phone: user.phone, zone: user.zone, role: user.role, company: user.company } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
