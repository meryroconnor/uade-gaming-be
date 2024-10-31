const CompanyAnalytics = sequelize.define('CompanyAnalytics', {
    companyId: { type: DataTypes.STRING, allowNull: true },
    totalOrders: { type: DataTypes.DECIMAL, allowNull: true },
    totalSales: { type: DataTypes.DECIMAL, allowNull: true },
    customerSatisfaction: { type: DataTypes.DECIMAL, allowNull: true }
  });
  
  module.exports = CompanyAnalytics;