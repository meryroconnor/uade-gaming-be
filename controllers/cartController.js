const Cart = require('../models/cart');
const CartItem = require('../models/cartItem');
const Game = require('../models/game');
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const PaymentMethod = require('../models/paymentMethod');
const GameComment = require('../models/gameComment');

exports.getCartDetails = async (req, res) => {
  try {
    const { cartId } = req.params;
    const userId = req.user.id;

    // Buscar el carrito especificado, asegurando que pertenece al usuario autenticado
    const cart = await Cart.findOne({
      where: { id: cartId, userId },
      include: {
        model: Game,
        attributes: [
          'id', 'name', 'price', 'category', 'description', 'image',
          'recommendedRequirements', 'minRequirements', 'os', 'players',
          'language', 'isPublished', 'rating'
        ],
        include: [
          {
            model: Company,
            attributes: ['id', 'name', 'logo', 'description']
          },
          {
            model: GameComment,
            attributes: ['userId', 'rating', 'content']
          }
        ]
      }
    });

    // Verificar si el carrito existe
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Calcular el precio total del carrito
    const totalPrice = cart.Games.reduce((total, game) => total + game.price, 0);

    // Estructurar la respuesta
    const cartDetails = {
      id: cart.id,
      userId: cart.userId,
      totalPrice: totalPrice,
      items: cart.Games.map(game => ({
        id: game.id,
        name: game.name,
        price: game.price,
        category: game.category,
        description: game.description,
        image: game.image,
        recommendedRequirements: game.recommendedRequirements,
        minRequirements: game.minRequirements,
        os: game.os,
        players: game.players,
        language: game.language,
        isPublished: game.isPublished,
        rating: game.rating,
        company: game.Company ? {
          id: game.Company.id,
          name: game.Company.name,
          logo: game.Company.logo,
          description: game.Company.description
        } : null,
        comments: game.GameComments.map(comment => ({
          userId: comment.userId,
          rating: comment.rating,
          content: comment.content
        }))
      }))
    };

    res.status(200).json(cartDetails);
  } catch (error) {
    console.error('Error fetching cart details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.checkoutCart = async (req, res) => {
  const t = await sequelize.transaction(); // Inicia una transacción para garantizar la integridad de datos
  try {
    const { cartId } = req.params;
    const { paymentMethodId } = req.body; // Se asume que el método de pago es proporcionado en el cuerpo de la solicitud
    const userId = req.user.id;

    // Verificar que el carrito existe y pertenece al usuario autenticado
    const cart = await Cart.findOne({
      where: { id: cartId, userId },
      include: { model: Game }
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Verificar que el método de pago es válido
    const paymentMethod = await PaymentMethod.findOne({
      where: { id: paymentMethodId, userId }
    });

    if (!paymentMethod) {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    // Calcular el total del precio
    const totalPrice = cart.Games.reduce((total, game) => total + game.price, 0);

    // Crear una nueva orden
    const newOrder = await Order.create({
      userId,
      totalPrice,
      status: 'pending'
    }, { transaction: t });

    // Agregar los elementos del carrito a la orden
    const orderItems = cart.Games.map(game => ({
      orderId: newOrder.id,
      gameId: game.id,
      price: game.price
    }));

    await OrderItem.bulkCreate(orderItems, { transaction: t });

    // Vaciar el carrito después de crear la orden
    await cart.setGames([], { transaction: t });

    // Confirmar la transacción
    await t.commit();

    // Responder con los detalles de la orden creada
    res.status(201).json({
      id: newOrder.id,
      userId: newOrder.userId,
      totalPrice: newOrder.totalPrice,
      status: newOrder.status,
      createdAt: newOrder.createdAt,
      updatedAt: newOrder.updatedAt,
      items: orderItems
    });
  } catch (error) {
    await t.rollback(); // Revertir la transacción si ocurre algún error
    console.error('Error processing checkout:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.removeGameFromCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { gameId } = req.query;
    const userId = req.user.id;

    // Verificar que el carrito existe y pertenece al usuario autenticado
    const cart = await Cart.findOne({
      where: { id: cartId, userId },
      include: {
        model: Game,
        where: { id: gameId },
        required: false
      }
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Verificar que el juego existe en el carrito
    const game = cart.Games.find(g => g.id === gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found in cart' });
    }

    // Eliminar el juego del carrito
    await cart.removeGame(game);

    res.status(204).json({
      id: game.id,
      name: game.name,
      price: game.price,
      image: game.image,
      description: game.description,
      category: game.category
    });
  } catch (error) {
    console.error('Error removing game from cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addGameToCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { gameId } = req.query;
    const userId = req.user.id;

    // Verificar que el carrito existe y pertenece al usuario autenticado
    const cart = await Cart.findOne({ where: { id: cartId, userId } });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Verificar que el juego existe
    const game = await Game.findByPk(gameId, {
      include: [
        {
          model: require('../models/company'),
          attributes: ['id', 'name', 'logo', 'description']
        },
        {
          model: require('../models/gameComment'),
          attributes: ['userId', 'rating', 'content']
        }
      ]
    });

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Agregar el juego al carrito
    await cart.addGame(game);

    // Responder con los detalles del juego añadido
    res.status(201).json({
      id: game.id,
      name: game.name,
      price: game.price,
      category: game.category,
      description: game.description,
      image: game.image,
      recommendedRequirements: game.recommendedRequirements,
      minRequirements: game.minRequirements,
      os: game.os,
      players: game.players,
      language: game.language,
      isPublished: game.isPublished,
      rating: game.rating,
      company: game.Company ? {
        id: game.Company.id,
        name: game.Company.name,
        logo: game.Company.logo,
        description: game.Company.description
      } : null,
      comments: game.GameComments.map(comment => ({
        userId: comment.userId,
        rating: comment.rating,
        content: comment.content
      }))
    });
  } catch (error) {
    console.error('Error adding game to cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Crear un nuevo carrito vacío para el usuario autenticado
    const newCart = await Cart.create({
      userId,
      totalPrice: 0 // El carrito comienza vacío, con totalPrice en 0
    });

    // Responder con los detalles del carrito creado
    res.status(201).json({
      id: newCart.id,
      userId: newCart.userId,
      totalPrice: newCart.totalPrice,
      items: [] // El carrito está vacío inicialmente
    });
  } catch (error) {
    console.error('Error creating cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};