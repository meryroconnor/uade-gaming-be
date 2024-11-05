const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CompanyAnalytics = sequelize.define('CompanyAnalytics', {
    companyId: { type: DataTypes.STRING, allowNull: false },
    totalOrders: { type: DataTypes.DECIMAL },
    totalSales: { type: DataTypes.DECIMAL },
    customerSatisfaction: { type: DataTypes.DECIMAL }
});

GameAnalytics.belongsTo(Game, { foreignKey: 'gameId' });
Game.hasMany(GameAnalytics, { foreignKey: 'gameId' });

module.exports = CompanyAnalytics;