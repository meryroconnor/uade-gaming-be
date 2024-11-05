const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Company = require('./company');  // Relación con Company
const Comment = require('./comment');

const Game = sequelize.define('Game', {
  id: { type: DataTypes.STRING, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING },
  players: { type: DataTypes.STRING },
  language: { type: DataTypes.ARRAY(DataTypes.STRING) },
  os: { type: DataTypes.ARRAY(DataTypes.STRING) },
  description: { type: DataTypes.TEXT },
  minRequirements: { type: DataTypes.TEXT },
  recommendedRequirements: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL },
  rating: { type: DataTypes.FLOAT },
  isPublished: { type: DataTypes.BOOLEAN, defaultValue: false },
});

Game.belongsTo(Company, { foreignKey: 'companyId' });
Game.hasMany(Comment, { foreignKey: 'gameId' });
Comment.belongsTo(Game, { foreignKey: 'gameId' });

module.exports = Game;