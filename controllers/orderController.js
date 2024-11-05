const Order = require('../models/order');
const Game = require('../models/game');
const Company = require('../models/company');

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario autenticado

    // Obtener todas las órdenes del usuario autenticado e incluir detalles de los juegos y las compañías
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: Game,
          include: {
            model: Company,
            attributes: ['id', 'name', 'logo', 'description']
          }
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id; // ID del usuario autenticado

    // Buscar la orden por ID y verificar que pertenece al usuario autenticado
    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [
        {
          model: Game,
          include: {
            model: Company,
            attributes: ['id', 'name', 'logo', 'description']
          }
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};