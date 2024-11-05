const CompanyAnalytics = require('../models/companyAnalytics');
const GameAnalytics = require('../models/gameAnalytics');
const Game = require('../models/game');
const { Op } = require('sequelize');

exports.getCompanyAnalytics = async (req, res) => {
  try {
    const companyId = req.user.companyId; // ID de la compañía autenticada
    const { category, period, page = 1, pageSize = 5 } = req.query;

    // Obtener los datos de análisis de la compañía
    const companyAnalytics = await CompanyAnalytics.findOne({ where: { companyId } });
    if (!companyAnalytics) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Configuración de filtros para análisis de juegos
    const filters = { companyId };
    if (category) {
      filters.category = category;
    }
    if (period) {
      filters.salesPeriod = { [Op.startsWith]: period }; // Filtrar por periodo (YYYY-MM)
    }

    // Paginación de datos de análisis de juegos
    const offset = (page - 1) * pageSize;

    // Obtener análisis de cada juego con los filtros y la paginación aplicada
    const gameAnalytics = await GameAnalytics.findAll({
      where: filters,
      include: {
        model: Game,
        attributes: ['id', 'name']
      },
      offset,
      limit: parseInt(pageSize),
      attributes: [
        'gameId', 'revenue', 'wishlistAdditions', 'averageRating', 'sales', 'views'
      ]
    });

    // Estructurar la respuesta con los datos de la compañía y de los juegos
    res.status(200).json({
      companyId: companyAnalytics.companyId,
      totalSales: companyAnalytics.totalSales,
      totalOrders: companyAnalytics.totalOrders,
      customerSatisfaction: companyAnalytics.customerSatisfaction,
      gameAnalytics: gameAnalytics.map(ga => ({
        gameId: ga.gameId,
        gameName: ga.Game.name,
        revenue: ga.revenue,
        wishlistAdditions: ga.wishlistAdditions,
        averageRating: ga.averageRating,
        sales: ga.sales,
        views: ga.views
      }))
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};