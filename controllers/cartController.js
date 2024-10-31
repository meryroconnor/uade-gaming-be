const Cart = require('../models/cart');
const CartItem = require('../models/cartItem');
const Game = require('../models/game');
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const PaymentMethod = require('../models/paymentMethod');

exports.createCart = async (req, res) => {
  try {
    const userId = req.user.id; // Usuario autenticado
    const newCart = await Cart.create({ userId, totalPrice: 0 });

    res.status(201).json(newCart);
  } catch (error) {
    console.error('Error creating cart:', error);
    res.status(500).json({ error: 'Error creating cart' });
  }
};

exports.getCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const cart = await Cart.findByPk(cartId, {
      include: ['CartItems']
    });

    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Error fetching cart' });
  }
};

exports.addItemToCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { gameId, quantity } = req.body;

    const game = await Game.findByPk(gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    const cartItem = await CartItem.create({ cartId, gameId, quantity, price: game.price });
    res.status(201).json(cartItem);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ error: 'Error adding item to cart' });
  }
};

exports.removeItemFromCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { gameId } = req.query;

    const cartItem = await CartItem.findOne({ where: { cartId, gameId } });
    if (!cartItem) return res.status(404).json({ error: 'Game not found in cart' });

    await cartItem.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Error removing item from cart' });
  }
};

exports.checkoutCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { paymentMethodId } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findByPk(cartId, { include: CartItem });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const paymentMethod = await PaymentMethod.findByPk(paymentMethodId);
    if (!paymentMethod) return res.status(400).json({ error: 'Invalid payment method' });

    const order = await Order.create({
      userId,
      totalPrice: cart.totalPrice,
      status: 'completed'
    });

    const orderItems = await Promise.all(cart.CartItems.map(async item => {
      return OrderItem.create({
        orderId: order.id,
        gameId: item.gameId,
        quantity: item.quantity,
        price: item.price
      });
    }));

    await CartItem.destroy({ where: { cartId } });
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({ order, orderItems });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ error: 'Error during checkout' });
  }
};
