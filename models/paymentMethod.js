const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const PaymentMethod = sequelize.define('PaymentMethod', {
  type: {
    type: DataTypes.ENUM('credit', 'debit'),  // e.g., 'credit_card', 'paypal'
    allowNull: false,
  },
  cardDetails: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
});

module.exports = PaymentMethod;