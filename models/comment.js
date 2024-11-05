const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Game = require('./game');

const Comment = sequelize.define('Comment', {
  userId: { type: DataTypes.STRING, allowNull: false },
  rating: { type: DataTypes.INTEGER},
  content: { type: DataTypes.TEXT}
});

Comment.belongsTo(Game, { foreignKey: 'gameId' });

module.exports = Comment;