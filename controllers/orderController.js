const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const Game = require('../models/game');

// Obtener todas las órdenes del usuario autenticado
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          include: {
            model: Game,
            attributes: ['id', 'name', 'price', 'description', 'category', 'imageUrl', 'os', 'players', 'language', 'minRequirements', 'recommendedRequirements'],
          },
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [
        {
          model: OrderItem,
          include: {
            model: Game,
            attributes: ['id', 'name', 'price', 'description', 'category', 'imageUrl', 'os', 'players', 'language', 'minRequirements', 'recommendedRequirements'],
          },
        },
      ],
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};