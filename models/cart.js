const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cart = sequelize.define('Cart', {
  id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
  userId: { type: DataTypes.STRING, allowNull: true },
  totalPrice: { type: DataTypes.DECIMAL, allowNull: true }
});

module.exports = Cart;