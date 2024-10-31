const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Game = require('./game');

const Wishlist = sequelize.define('Wishlist', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: false,
  },
  gameId: {
    type: DataTypes.INTEGER,
    references: {
      model: Game,
      key: 'id'
    },
    allowNull: false,
  }
}, {
  timestamps: false
});

module.exports = Wishlist;