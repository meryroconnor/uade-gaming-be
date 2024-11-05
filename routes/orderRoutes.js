const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Rutas para órdenes
router.get('/orders', authMiddleware, orderController.getUserOrders);  // Obtener todas las órdenes del usuario
router.get('/orders/:orderId', authMiddleware, orderController.getOrderDetails);

module.exports = router;