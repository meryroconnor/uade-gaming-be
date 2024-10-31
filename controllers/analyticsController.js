const Company = require('../models/company');
const Game = require('../models/game');
const Order = require('../models/order');
const { Op } = require('sequelize');

// Obtener analítica de los juegos de la compañía
exports.getCompanyAnalytics = async (req, res) => {
  try {
    const companyId = req.user.id;  // Obtener el ID de la compañía autenticada
    const { category, period, page = 1, pageSize = 5 } = req.query;

    // Verificar que la compañía existe
    const company = await Company.findByPk(companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Filtros de juegos de la compañía
    const gameFilters = { companyId };
    if (category) {
      gameFilters.category = category;
    }

    // Obtener juegos de la compañía con el filtro de categoría
    const games = await Game.findAll({
      where: gameFilters,
      include: [{
        model: Order,
        where: period ? {
          createdAt: {
            [Op.between]: [
              new Date(`${period}-01`),  // Inicio del período
              new Date(`${period}-31`)   // Fin del período
            ]
          }
        } : {},
        required: false,  // Incluir juegos aunque no tengan órdenes
      }],
      offset: (page - 1) * pageSize,
      limit: parseInt(pageSize),
    });

    // Calcular las métricas para cada juego y para la compañía en general
    let totalSales = 0;
    let totalOrders = 0;
    let customerSatisfaction = 0;
    const gameAnalytics = games.map(game => {
      const sales = game.Orders.length;
      const revenue = game.Orders.reduce((acc, order) => acc + order.totalPrice, 0);
      const averageRating = game.rating || 0;  // Supuesto: la calificación promedio del juego está en `game.rating`
      const wishlistAdditions = game.wishlistAdditions || 0;  // Supuesto: cantidad de añadidos a la wishlist
      const views = game.views || 0;  // Supuesto: cantidad de visualizaciones del juego

      // Agregar los datos de este juego a las métricas generales de la compañía
      totalSales += revenue;
      totalOrders += sales;
      customerSatisfaction += averageRating;

      return {
        gameId: game.id,
        gameName: game.name,
        revenue,
        wishlistAdditions,
        averageRating,
        sales,
        views,
      };
    });

    // Calcular la satisfacción promedio del cliente
    customerSatisfaction = games.length ? (customerSatisfaction / games.length) : 0;

    // Responder con los datos de `CompanyAnalytics`
    res.json({
      companyId,
      totalSales,
      totalOrders,
      customerSatisfaction,
      gameAnalytics
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Error fetching analytics' });
  }
};