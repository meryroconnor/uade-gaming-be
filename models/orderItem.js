const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./order');
const Game = require('./game');

const OrderItem = sequelize.define('OrderItem', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
      key: 'id'
    }
  },
  gameId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Game,
      key: 'id'
    }
  },
}, {
  timestamps: false,
});

OrderItem.belongsTo(Game, { foreignKey: 'gameId' });
Game.hasMany(OrderItem, { foreignKey: 'gameId' });

module.exports = OrderItem;