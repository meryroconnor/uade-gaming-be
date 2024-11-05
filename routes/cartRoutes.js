const express = require('express');
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/carts/:cartId', authMiddleware, cartController.getCartDetails);
router.post('/carts/:cartId/checkout', authMiddleware, cartController.checkoutCart);
router.delete('/carts/:cartId/items', authMiddleware, cartController.removeGameFromCart);
router.post('/carts/:cartId/items', authMiddleware, cartController.addGameToCart);
router.post('/carts', authMiddleware, cartController.createCart);

module.exports = router;