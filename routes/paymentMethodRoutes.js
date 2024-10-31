const express = require('express');
const paymentMethodController = require('../controllers/paymentMethodController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Rutas para métodos de pago
router.get('/payment-methods', authMiddleware, paymentMethodController.getUserPaymentMethods);  // Obtener métodos de pago
router.post('/payment-methods', authMiddleware, paymentMethodController.createPaymentMethod);  // Registrar método de pago
router.delete('/payment-methods/:paymentMethodId', authMiddleware, paymentMethodController.deletePaymentMethod);  // Eliminar método de pago

module.exports = router;