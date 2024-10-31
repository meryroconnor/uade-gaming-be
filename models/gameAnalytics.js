const GameAnalytics = sequelize.define('GameAnalytics', {
    gameId: { type: DataTypes.STRING, allowNull: true },
    gameName: { type: DataTypes.STRING, allowNull: true },
    sales: { type: DataTypes.INTEGER, allowNull: true },
    revenue: { type: DataTypes.DECIMAL, allowNull: true },
    averageRating: { type: DataTypes.DECIMAL, allowNull: true },
    views: { type: DataTypes.INTEGER, allowNull: true },
    wishlistAdditions: { type: DataTypes.INTEGER, allowNull: true }
});

module.exports = GameAnalytics;