const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Game = require('./game');

const Cart = sequelize.define('Cart', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  userId: { type: DataTypes.STRING, allowNull: false },
  totalPrice: { type: DataTypes.DECIMAL, defaultValue: 0 }
});

Cart.belongsToMany(Game, { through: 'CartItems', foreignKey: 'cartId' });
Game.belongsToMany(Cart, { through: 'CartItems', foreignKey: 'gameId' });

module.exports = Cart;