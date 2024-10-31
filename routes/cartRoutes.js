const express = require('express');
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/carts', authMiddleware, cartController.createCart);
router.get('/carts/:cartId', authMiddleware, cartController.getCart);
router.post('/carts/:cartId/items', authMiddleware, cartController.addItemToCart);
router.delete('/carts/:cartId/items', authMiddleware, cartController.removeItemFromCart);
router.post('/carts/:cartId/checkout', authMiddleware, cartController.checkoutCart);

module.exports = router;