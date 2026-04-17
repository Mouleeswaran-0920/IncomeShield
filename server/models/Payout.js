const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payout = sequelize.define('Payout', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'PROCESSED', 'FAILED'),
        defaultValue: 'PROCESSED'
    },
    loss_amount: {
        type: DataTypes.FLOAT
    },
    disruption_type: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true
});

module.exports = Payout;
