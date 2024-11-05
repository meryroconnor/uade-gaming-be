const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const OrderItem = require('./orderItem');
const Game = require('./game');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.STRING, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  totalPrice: { type: DataTypes.DECIMAL },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
Order.belongsToMany(Game, { through: 'OrderItems', foreignKey: 'orderId' });
Game.belongsToMany(Order, { through: 'OrderItems', foreignKey: 'gameId' });

module.exports = Order;