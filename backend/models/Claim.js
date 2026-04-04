const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Claim = sequelize.define('Claim', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    loss: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    payout: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'APPROVED', 'PAID', 'REJECTED'),
        defaultValue: 'PENDING'
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Claim;
