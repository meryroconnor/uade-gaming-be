const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GameAnalytics = sequelize.define('GameAnalytics', {
  gameId: { type: DataTypes.STRING, allowNull: false },
  gameName: { type: DataTypes.STRING },
  sales: { type: DataTypes.INTEGER },
  revenue: { type: DataTypes.DECIMAL },
  averageRating: { type: DataTypes.FLOAT },
  views: { type: DataTypes.INTEGER },
  wishlistAdditions: { type: DataTypes.INTEGER }
});

module.exports = GameAnalytics;