const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Earning = sequelize.define('Earning', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    predicted_income: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    actual_income: {
        type: DataTypes.FLOAT,
        allowNull: true
    }
});

module.exports = Earning;
