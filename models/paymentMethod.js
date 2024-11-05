const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PaymentMethods = sequelize.define('PaymentMethods', {
  userId: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM('credit', 'debit'), allowNull: false },
  cardDetails: {
    type: DataTypes.JSON,
    validate: {
      isCreditCard: {
        args: true,
        msg: 'Invalid credit card number'
      }
    }
  }
});
module.exports = PaymentMethod;